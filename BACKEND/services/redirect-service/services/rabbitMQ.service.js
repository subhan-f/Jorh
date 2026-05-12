import { publishToQueue, subscribeToQueue } from "../utils/rabbitMQ.js";
import mappingService from "./mapping.service.js";

class RabbitMQService {
  subscribeToLinks = () => {
    subscribeToQueue("links", async (data) => {
      try {
        let mapping = " _default_ ";
        data = JSON.parse(data);
        switch (data.action) {
          case "create":
            console.log("New link created: ", data);
            mapping = await mappingService.createMapping({
              _id: data.slug,
              originalUrl: data.originalUrl,
              expiresAt: data.expiresAt,
            });
            console.log("Mapping created: ", mapping);
            break;

          case "update":
            console.log("Link updated: ", data);
            mapping = await mappingService.updateMapping({
              _id: data.slug,
              originalUrl: data.originalUrl,
              expiresAt: data.expiresAt,
            });
            console.log("Mapping updated: ", mapping);
            break;

          case "delete":
            console.log("Link deleted: ", data);
            mapping = await mappingService.deleteMapping({
              _id: data.slug,
            });
            console.log("Mapping deleted: ", mapping);
            break;

          default:
            console.log("Unknown action: ", data);
        }
      } catch (err) {
        console.error("Failed to process links message: ", err);
      }
    });
  };

  publishClick = async (clickData) => {
    publishToQueue(
      "clicks",
      JSON.stringify({
        slug: clickData.slug,
        ip: clickData.ip,
        userAgent: clickData.userAgent,
        referrer: clickData.referrer,
      })
    );
  };
}

const rabbitmqService = new RabbitMQService();
export default rabbitmqService;
