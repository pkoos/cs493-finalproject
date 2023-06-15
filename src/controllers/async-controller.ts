import { Request, Response } from 'express';
import amqp from 'amqplib';
import Jimp from 'jimp';

import { Character } from '../models/character';
import { CharacterClass } from '../models/character-class';
import { CharacterImage } from '../models/character-image';
import { Stats } from '../models/stats';
import { Race } from '../models/race';

import { successResponse } from '../utils/responses-helper';

import { Configuration, OpenAIApi } from "openai";

const openai_configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openai_configuration);

const rabbitmqHost: string = process.env.RABBITMQ_HOST ?? "localhost";
const rabbitmqUrl: string = `amqp://${rabbitmqHost}`;
var connection: amqp.Connection;
var channel: amqp.Channel;

const queues: string[] = ['testQueue', 'thumbnailQueue', 'characterDescriptionQueue'];

async function generateThumbnail(message: amqp.ConsumeMessage | null): Promise<void> {
    if (message === null) {
        return;
    }

    channel.ack(message);
    const image_id: number = parseInt(message.content.toString());
    const image: CharacterImage | undefined = await new CharacterImage().findById(image_id);

    if (image === undefined || !image.isValid()) {
        console.log(image);
        return;
    }

    const image_buffer: Buffer = image.image_data as Buffer;
    const image_jimp: Jimp = await Jimp.read(image_buffer);
    const image_thumbnail: Jimp = image_jimp.resize(128, 128);
    const image_thumbnail_buffer: Buffer = await image_thumbnail.getBufferAsync(image.content_type);
    image.thumbnail_data = image_thumbnail_buffer;

    if (!(await image.update())) {
        console.log("Failed to update image thumbnail");
        return;
    }
    console.log("Finished generating thumbnail for image " + image_id);
}

async function generateCharacterDescription(message: amqp.ConsumeMessage | null): Promise<void> {
    if (message === null) {
        return;
    }

    channel.ack(message);

    const pc_id: number = parseInt(message.content.toString());

    const pc: Character | undefined = await new Character().findById(pc_id);

    if (pc === undefined || !pc.isValid()) {
        console.log(`Unable to locate character so unable to generate background for ${pc_id}`);
        return;
    }

    const race: Race | undefined  = await new Race().findById(pc.race_id);
    const characterClass: CharacterClass | undefined = await new CharacterClass().findById(pc.class_id);

    let racePrompt: string;

    if (race === undefined || !race.isValid()) {
        console.log(`Unable to locate race for character ${pc_id}. Generating background without it.`);
        racePrompt = "";
    } else {
        racePrompt = race.name;
    }

    let classPrompt: string;

    if (characterClass === undefined || !characterClass.isValid()) {
        console.log(`Unable to locate class for character ${pc_id}. Generating background without it.`);
        classPrompt = "hero";
    } else {
        classPrompt = characterClass.name;
    }

    const pc_stats: Stats | undefined = await new Stats().findById(pc.stats_id);

    let statsPrompt: string;
    if (pc_stats === undefined || !pc_stats.isValid()) {
        console.log(`Unable to locate stats for character ${pc_id} with stats id ${pc.stats_id}. Generating background without stats info.`);
        statsPrompt = "";
    } else {
        statsPrompt = ` with a ${pc_stats.strength} strength, ${pc_stats.dexterity} dexterity, ${pc_stats.constitution} constitution, ${pc_stats.intelligence} intelligence, ${pc_stats.wisdom} wisdom, and ${pc_stats.charisma} charisma`;
    }

    const prompt: string = `Generate a short character background for a ${pc.alignment} ${racePrompt} ${classPrompt} called ${pc.name}${statsPrompt}.`;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "system", "content": "You are a fantastic bard who produces epic stories of heroes."},
            {role: "user", content: prompt}
        ],
    });

    pc.background = completion.data.choices[0].message?.content ?? "";
    if (pc.background == "") {
        console.log(`Unable to generate background for ${pc_id} due to OpenAI not returning content.`);
    } else {
        console.log(`Generated background for ${pc_id}: ${pc.background}`);
    }

    if (!await pc.update()) {
        console.log(`Update failed for generated background for ${pc_id}`);
    }
}

export async function initializeAsyncController() {
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    queues.forEach(async (queue) => { await channel.assertQueue(queue); });

    channel.consume('testQueue', (message) => { console.log(message?.content.toString()); }, { noAck: true });
    channel.consume('thumbnailQueue', generateThumbnail, { noAck: false });
    channel.consume('characterDescriptionQueue', generateCharacterDescription, { noAck: false });
}

export async function requestTest(message: string) {
    channel.sendToQueue('testQueue', Buffer.from(message));
}

export async function requestImageThumbnail(image_id: number): Promise<void> {
    channel.sendToQueue('thumbnailQueue', Buffer.from(image_id.toString()));
}

export function requestCharacterDescription(pc_id: number) {
    channel.sendToQueue('characterDescriptionQueue', Buffer.from(pc_id.toString()));
}
