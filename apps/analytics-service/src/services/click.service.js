import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import ClickModel from "../models/click.model.js";
import linkStatsService from "./linkStats.service.js";
import logger from "../config/logger.js";

class ClickService {
  recordClick = async (clickData) => {
    const geo = geoip.lookup(clickData.ip);
    const ua = new UAParser(clickData.userAgent).getResult();

    const enriched = {
      ...clickData,
      country: geo?.country ?? null,
      city: geo?.city ?? null,
      deviceType: ua.device?.type ?? "desktop",
      browser: ua.browser?.name ?? null,
      os: ua.os?.name ?? null,
    };

    const click = await ClickModel.create(enriched);

    // Check uniqueness: if this is the only click from this IP for this slug, it's unique
    const ipClickCount = await ClickModel.countDocuments({ slug: click.slug, ip: click.ip });
    const isUnique = ipClickCount === 1;

    linkStatsService
      .updateStats(click.slug, click, isUnique)
      .catch((err) => logger.error({ err: err.message, slug: click.slug }, "stats update failed"));

    return click;
  };

  getClicks = async (filter = {}, pagination = {}) => {
    return ClickModel.find(filter)
      .skip(pagination.skip || 0)
      .limit(pagination.limit || 50)
      .sort({ timestamp: -1 });
  };

  getClicksCount = async (filter = {}) => {
    return ClickModel.countDocuments(filter);
  };
}

const clickService = new ClickService();
export default clickService;
