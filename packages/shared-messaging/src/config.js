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
    process.stderr.write(`[RabbitMQ] connection error: ${err.message}\n`);
    connection = null;
    channel = null;
  });

  connection.on("close", () => {
    process.stderr.write("[RabbitMQ] connection closed — exiting for container restart\n");
    process.exit(1);
  });

  process.stdout.write("[RabbitMQ] connected\n");
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
