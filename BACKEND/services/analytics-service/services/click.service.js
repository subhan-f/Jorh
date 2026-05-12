import clickModel from "../models/click.model.js";
import linkStatsService from "./linkStats.service.js";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

class ClickService {
  recordClick = async (clickData) => {
    console.log("Recording click: ", clickData);

    const geo = geoip.lookup(clickData.ip);

    if (geo) {
      console.log("GEO DATA: ", JSON.stringify(geo));
    }

    const parser = new UAParser(clickData.userAgent);
    const uaResult = parser.getResult();

    clickData.country = geo?.country;
    clickData.city = geo?.city;
    clickData.deviceType = uaResult.device?.model;
    clickData.browser = uaResult.browser?.name;
    clickData.os = uaResult.os?.name;

    const click = await clickModel.create(clickData);
    if (!click) throw new Error("Failed to record click");

    // Update aggregated stats asynchronously (do not block the response)
    linkStatsService
      .updateStats(click.slug, click)
      .catch((err) => console.error("Stats update failed:", err));

    return click;
  };

  getClicks = async (filter = {}, pagination = {}) => {
    const clicks = await clickModel
      .find(filter)
      .skip(pagination.skip || 0)
      .limit(pagination.limit || 50)
      .sort({ timestamp: -1 });
    return clicks;
  };

  getClicksCount = async (filter = {}) => {
    return await clickModel.countDocuments(filter);
  };
}

const clickService = new ClickService();
export default clickService;
