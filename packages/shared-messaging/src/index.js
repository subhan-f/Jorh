import { connectMQ, disconnectMQ } from "./config.js";
import { EXCHANGES } from "./exchanges.js";

export { connectMQ, disconnectMQ, EXCHANGES };

/**
 * Publish a message to a fanout exchange.
 * Every queue bound to the exchange receives its own copy.
 *
 * @param {string} exchange - One of EXCHANGES.*
 * @param {object} message
 */
export async function publishEvent(exchange, message) {
  const ch = await connectMQ();
  await ch.assertExchange(exchange, "fanout", { durable: true });
  ch.publish(exchange, "", Buffer.from(JSON.stringify(message)), { persistent: true });
}

/**
 * Subscribe to a fanout exchange with a named, durable queue.
 * Named queues survive restarts so no messages are lost while the service is down.
 *
 * @param {string} exchange  - One of EXCHANGES.*
 * @param {string} queueName - Unique per (service × exchange) e.g. "redirect.link-events"
 * @param {function} handler - async (message: object) => void
 */
export async function subscribeToEvent(exchange, queueName, handler) {
  const ch = await connectMQ();
  await ch.assertExchange(exchange, "fanout", { durable: true });
  const { queue } = await ch.assertQueue(queueName, { durable: true });
  await ch.bindQueue(queue, exchange, "");
  ch.prefetch(1);
  ch.consume(queue, async (msg) => {
    if (!msg) return;
    try {
      const content = JSON.parse(msg.content.toString());
      await handler(content);
      ch.ack(msg);
    } catch (err) {
      console.error(`[RabbitMQ] handler error on ${queueName}:`, err.message);
      ch.nack(msg, false, false); // dead-letter; don't requeue poison messages
    }
  });
}
