import { publishToQueue } from "../utils/rabbitMQ.js";

class RabbitMQService {
  publishCreatedLink = async (link) => {
    link.action = "create";
    console.log("Link DATA from RMQ Service", link);

    await publishToQueue("links", JSON.stringify(link));
  };
  publishUpdatedLink = async (link) => {
    link.action = "update";
    console.log("Link DATA from RMQ Service", link);
    await publishToQueue("links", JSON.stringify(link));
  };
  publishDeletedLink = async (link) => {
    link.action = "delete";
    console.log("Link DATA from RMQ Service", link);
    await publishToQueue("links", JSON.stringify(link));
  };
}

const rabbitmqService = new RabbitMQService();
export default rabbitmqService;
