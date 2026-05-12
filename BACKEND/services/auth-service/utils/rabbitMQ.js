import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL;
if (!RABBITMQ_URL) throw new Error("RABBITMQ_URL is required");

let connection = null;
let channel = null;

const connect = async () => {
  if (channel) return channel;

  connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();

  connection.on("error", (err) => {
    console.error("[RabbitMQ] connection error:", err.message);
    connection = null;
    channel = null;
  });

  // Reconnect automatically when the broker closes the connection
  connection.on("close", () => {
    console.warn("[RabbitMQ] connection closed — reconnecting in 5s");
    connection = null;
    channel = null;
    setTimeout(connect, 5000);
  });

  console.log("[RabbitMQ] connected");
  return channel;
};

/**
 * Publish a message to a durable queue.
 * The message is persisted so it survives a broker restart.
 */
const publishToQueue = async (queue, message) => {
  const ch = await connect();
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
};

/**
 * Subscribe to a durable queue.
 * handler(parsedMessage) is called for each message.
 * Messages are ack'd on success or nack'd (no requeue) on handler error.
 */
const subscribeToQueue = async (queue, handler) => {
  const ch = await connect();
  await ch.assertQueue(queue, { durable: true });
  ch.prefetch(1); // process one message at a time per consumer
  ch.consume(queue, async (msg) => {
    if (!msg) return;
    try {
      const content = JSON.parse(msg.content.toString());
      await handler(content);
      ch.ack(msg);
    } catch (err) {
      console.error("[RabbitMQ] handler error:", err.message);
      ch.nack(msg, false, false); // discard — route to dead-letter if configured
    }
  });
};

export default { connect, publishToQueue, subscribeToQueue };
