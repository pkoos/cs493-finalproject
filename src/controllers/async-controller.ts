import amqp from 'amqplib';
import Jimp from 'jimp';

import { CharacterImage } from '../models/character-image';

const rabbitmqHost: string = process.env.RABBITMQ_HOST ?? "localhost";
const rabbitmqUrl: string = `amqp://${rabbitmqHost}`;
var connection: amqp.Connection;
var channel: amqp.Channel;
const queues: string[] = ['testQueue', 'thumbnailQueue'];

async function generateThumbnail(message: amqp.ConsumeMessage | null): Promise<void> {
    if (message === null) {
        return;
    }

    channel.ack(message);
    const image_id: number = parseInt(message.content.toString());
    const image: CharacterImage = await new CharacterImage().findById(image_id);

    if (!image.isValid()) {
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

export async function initializeAsyncController() {
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    queues.forEach(async (queue) => { await channel.assertQueue(queue); });

    channel.consume('testQueue', (message) => { console.log(message?.content.toString()); }, { noAck: true });
    channel.consume('thumbnailQueue', generateThumbnail, { noAck: false });
}

export async function requestTest(message: string) {
    channel.sendToQueue('testQueue', Buffer.from(message));
}

export async function requestImageThumbnail(image_id: number): Promise<void> {
    channel.sendToQueue('thumbnailQueue', Buffer.from(image_id.toString()));
}
