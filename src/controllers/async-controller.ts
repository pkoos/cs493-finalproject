import amqp from 'amqplib';

const rabbitmqHost: string = process.env.RABBITMQ_HOST ?? "localhost";
const rabbitmqUrl: string = `amqp://${rabbitmqHost}`;
var connection: amqp.Connection;
var channel: amqp.Channel;
const queues: string[] = ['testQueue'];

export async function initializeAsyncController() {
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
    queues.forEach(async (queue) => { await channel.assertQueue(queue); });

    channel.consume('testQueue', (message) => { console.log(message?.content.toString()); }, { noAck: true });
}

export async function requestTest(message: string) {
    channel.sendToQueue('testQueue', Buffer.from(message));
}
