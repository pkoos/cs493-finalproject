import { Request, Response } from 'express';
import amqp from 'amqplib';
import Jimp from 'jimp';

import { CharacterImage } from '../models/character-image';

import { generate_dice_roll } from '../utils/number-generation';
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

    const str: number = generate_dice_roll(3, 6);
    const dex: number = generate_dice_roll(3, 6);
    const con: number = generate_dice_roll(3, 6);
    const int: number = generate_dice_roll(3, 6);
    const wis: number = generate_dice_roll(3, 6);
    const cha: number = generate_dice_roll(3, 6);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "system", "content": "You are a fantastic bard who produces epic stories of heroes."},
            {role: "user", content: `Generate a short character description of a barbarian with a ${str} strength, ${dex} dexterity, ${con} constitution, ${int} intelligence, ${wis} wisdom, and ${cha} charisma.`}
        ],
    });
    console.log(completion.data.choices[0].message?.content);
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

export function requestCharacterDescription(req: Request, res: Response) {
    const pc_id: number = parseInt(req.params.pc_id);
    channel.sendToQueue('characterDescriptionQueue', Buffer.from(pc_id.toString()));
    successResponse(res, {pc_id: pc_id});
}
