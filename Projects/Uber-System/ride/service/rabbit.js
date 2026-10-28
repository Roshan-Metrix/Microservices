const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

let connection;
let channel;

async function connect() {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        console.log(":> RabbitMQ connected successfully");

        connection.on("error", (err) => {
            console.error("RabbitMQ connection error:", err.message);
        });

        connection.on("close", () => {
            console.error("RabbitMQ connection closed");
            connection = null;
            channel = null;
        });

        return connection;
    } catch (error) {
        console.error(":> Failed to connect to RabbitMQ:", error.message);
        connection = null;
        channel = null;
        return null;
    }
}

async function subscribeToQueue(queueName, callback) {
    try {
        if (!channel) {
            await connect();
        }

        if (!channel) {
            console.warn("RabbitMQ unavailable. Skipping subscription.");
            return;
        }

        await channel.assertQueue(queueName);

        await channel.consume(queueName, async (msg) => {
            if (!msg) return;

            try {
                await callback(msg.content.toString());
                channel?.ack(msg);
            } catch (error) {
                console.error("RabbitMQ message processing error:", error.message);
            }
        });
    } catch (error) {
        console.error("Subscribe to queue error:", error.message);
    }
}

async function publishToQueue(queueName, data) {
    try {
        if (!channel) {
            await connect();
        }

        if (!channel) {
            console.warn("RabbitMQ unavailable. Skipping message.");
            return;
        }

        await channel.assertQueue(queueName);

        channel.sendToQueue(
            queueName,
            Buffer.from(
                typeof data === 'string' ? data : JSON.stringify(data)
            )
        );
    } catch (error) {
        console.error("Publish to queue error:", error.message);
    }
}

module.exports = {
    connect,
    subscribeToQueue,
    publishToQueue
};
