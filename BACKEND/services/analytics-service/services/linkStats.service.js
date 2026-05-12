import LinkStats from "../models/linkStats.model.js";

class LinkStatsService {
  /**
   * Atomically update aggregated stats for a slug.
   * Uses MongoDB aggregation pipeline in the update to handle
   * daily clicks, top referrers, top countries, etc.
   */
  async updateStats(slug, click) {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const deviceField = click.deviceType === "mobile" ? "mobile"
                      : click.deviceType === "tablet" ? "tablet"
                      : "desktop";
    const browserName = click.browser || "Other";
    const osName = click.os || "Other";
    const referrer = click.referrer || "direct";
    const country = click.country || "Unknown";

    await LinkStats.findOneAndUpdate(
      { slug },
      [
        {
          $set: {
            totalClicks: { $add: [{ $ifNull: ["$totalClicks", 0] }, 1] },
            // Daily clicks: increment existing entry or push new one
            dailyClicks: {
              $cond: {
                if: { $in: [today, { $ifNull: ["$dailyClicks.date", []] }] },
                then: {
                  $map: {
                    input: { $ifNull: ["$dailyClicks", []] },
                    as: "dc",
                    in: {
                      date: "$$dc.date",
                      count: { $cond: [{ $eq: ["$$dc.date", today] }, { $add: ["$$dc.count", 1] }, "$$dc.count"] }
                    }
                  }
                },
                else: { $concatArrays: [{ $ifNull: ["$dailyClicks", []] }, [{ date: today, count: 1 }]] }
              }
            },
            // Top referrers: increment or push, then keep top 10
            topReferrers: this._updateTopArray("$topReferrers", referrer),
            // Top countries: same logic
            topCountries: this._updateTopArray("$topCountries", country),
            // Devices, browsers, OSs – use $inc on nested paths
            [`devices.${deviceField}`]: { $add: [{ $ifNull: [`$devices.${deviceField}`, 0] }, 1] },
            [`browsers.${browserName}`]: { $add: [{ $ifNull: [`$browsers.${browserName}`, 0] }, 1] },
            [`operatingSystems.${osName}`]: { $add: [{ $ifNull: [`$operatingSystems.${osName}`, 0] }, 1] },
            lastUpdated: new Date(),
          }
        }
      ],
      {
        returnDocument: 'after',
        upsert: true,
        updatePipeline: true,
      }
    );
  }

  /**
   * Returns a pipeline expression that updates a top‑N array.
   * If the referrer/country already exists, increment its count;
   * otherwise push a new entry. Then sort by count descending,
   * slice to keep only the top 10, and sort back for storage.
   */
  _updateTopArray(fieldExpr, newValue) {
    return {
      $slice: [
        {
          $sortArray: {
            input: {
              $cond: {
                if: { $in: [newValue, { $ifNull: [`${fieldExpr}.referrer`, []] }] },
                then: {
                  $map: {
                    input: { $ifNull: [fieldExpr, []] },
                    as: "item",
                    in: {
                      referrer: "$$item.referrer",
                      count: {
                        $cond: [{ $eq: ["$$item.referrer", newValue] },
                          { $add: ["$$item.count", 1] },
                          "$$item.count"
                        ]
                      }
                    }
                  }
                },
                else: { $concatArrays: [{ $ifNull: [fieldExpr, []] }, [{ referrer: newValue, count: 1 }]] }
              }
            },
            sortBy: { count: -1 }
          }
        },
        10
      ]
    };
  }

  async getStats(slug) {
    const stats = await LinkStats.findOne({ slug });
    return stats;
  }
}

const linkStatsService = new LinkStatsService();
export default linkStatsService;