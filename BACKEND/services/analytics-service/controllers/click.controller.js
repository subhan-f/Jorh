import clickService from "../services/click.service.js";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import rabbitmq from "../utils/rabbitMQ.js";

class ClickController {
  handleRecordClick = async (req, res, next) => {
    try {
      const slug = req.params.slug || req.body.slug;
      if (!slug) {
        throw new Error("Missing slug");
      }

      const { ip, userAgent, referrer } = req.body;

      if (!ip || !userAgent) {
        throw new Error("Missing required fields");
      }

      const click = await clickService.recordClick({
        slug,
        referrer,
        ip,
        userAgent,
      });

      if (!click) throw new Error("Failed to record click");

      res.status(201).json(click);
    } catch (error) {
      next(error);
    }
  };

  handleGetClicks = async (req, res, next) => {
    try {
      const { filter, pagination } = req.query;
      const clicks = await clickService.getClicks(filter, pagination);
      const count = await clickService.getClicksCount(filter);
      res.status(200).json({ clicks, count });
    } catch (error) {
      next(error);
    }
  };

  subscribeToClickEvents = () => {
    rabbitmq.subscribeToQueue("clicks", async (message) => {
      try {
        const clickData = JSON.parse(message);
        await clickService.recordClick(clickData);
      } catch (err) {
        console.error("Failed to process click event:", err);
      }
    });
  };
}

const clickController = new ClickController();
export default clickController;
