import amqp from "amqplib";

let connection = null;
let channel = null;
let _uri = null;

export async function connectMQ(uri) {
  if (uri) _uri = uri;
  if (!_uri) throw new Error("[RabbitMQ] URI not set — call connectMQ(uri) first");

  if (channel) return channel;

  connection = await amqp.connect(_uri);
  channel = await connection.createChannel();

  connection.on("error", (err) => {
    console.error("[RabbitMQ] connection error:", err.message);
    connection = null;
    channel = null;
  });

  connection.on("close", () => {
    console.warn("[RabbitMQ] connection closed — exiting for restart");
    process.exit(1);
  });

  console.log("[RabbitMQ] connected");
  return channel;
}

export async function disconnectMQ() {
  if (connection) {
    await connection.close();
    connection = null;
    channel = null;
    _uri = null;
  }
}
