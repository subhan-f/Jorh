import LinkStats from "../models/linkStats.model.js";

class LinkStatsService {
  async updateStats(slug, click, isUnique = false) {
    const today = new Date().toISOString().slice(0, 10);
    const deviceField =
      click.deviceType === "mobile" ? "mobile"
      : click.deviceType === "tablet" ? "tablet"
      : "desktop";
    const browser = click.browser || "Other";
    const os = click.os || "Other";
    const referrer = click.referrer || "direct";
    const country = click.country || "Unknown";

    await LinkStats.findOneAndUpdate(
      { slug },
      [
        {
          $set: {
            totalClicks: { $add: [{ $ifNull: ["$totalClicks", 0] }, 1] },
            uniqueClicks: { $add: [{ $ifNull: ["$uniqueClicks", 0] }, isUnique ? 1 : 0] },
            lastClickAt: new Date(),

            dailyClicks: {
              $cond: {
                if: { $in: [today, { $ifNull: ["$dailyClicks.date", []] }] },
                then: {
                  $map: {
                    input: { $ifNull: ["$dailyClicks", []] },
                    as: "dc",
                    in: {
                      date: "$$dc.date",
                      count: {
                        $cond: [
                          { $eq: ["$$dc.date", today] },
                          { $add: ["$$dc.count", 1] },
                          "$$dc.count",
                        ],
                      },
                    },
                  },
                },
                else: {
                  $concatArrays: [
                    { $ifNull: ["$dailyClicks", []] },
                    [{ date: today, count: 1 }],
                  ],
                },
              },
            },

            topReferrers: this._updateTopArray("$topReferrers", "referrer", referrer),
            topCountries: this._updateTopArray("$topCountries", "country", country),

            [`devices.${deviceField}`]: {
              $add: [{ $ifNull: [`$devices.${deviceField}`, 0] }, 1],
            },
            [`browsers.${browser}`]: {
              $add: [{ $ifNull: [`$browsers.${browser}`, 0] }, 1],
            },
            [`operatingSystems.${os}`]: {
              $add: [{ $ifNull: [`$operatingSystems.${os}`, 0] }, 1],
            },

            lastUpdated: new Date(),
          },
        },
      ],
      { upsert: true, returnDocument: "after", updatePipeline: true },
    );
  }

  /**
   * Builds a MongoDB aggregation expression that increments the count for an
   * existing entry or appends a new one, then keeps only the top 10 by count.
   *
   * @param {string} fieldExpr  - e.g. "$topReferrers"
   * @param {string} itemKey    - the key inside each array item, e.g. "referrer" or "country"
   * @param {string} newValue   - the value to increment/insert
   */
  _updateTopArray(fieldExpr, itemKey, newValue) {
    return {
      $slice: [
        {
          $sortArray: {
            input: {
              $cond: {
                if: { $in: [newValue, { $ifNull: [`${fieldExpr}.${itemKey}`, []] }] },
                then: {
                  $map: {
                    input: { $ifNull: [fieldExpr, []] },
                    as: "item",
                    in: {
                      [itemKey]: `$$item.${itemKey}`,
                      count: {
                        $cond: [
                          { $eq: [`$$item.${itemKey}`, newValue] },
                          { $add: ["$$item.count", 1] },
                          "$$item.count",
                        ],
                      },
                    },
                  },
                },
                else: {
                  $concatArrays: [
                    { $ifNull: [fieldExpr, []] },
                    [{ [itemKey]: newValue, count: 1 }],
                  ],
                },
              },
            },
            sortBy: { count: -1 },
          },
        },
        10,
      ],
    };
  }

  async deleteStats(slug) {
    await LinkStats.deleteOne({ slug });
  }

  async getStats(slug) {
    return LinkStats.findOne({ slug });
  }
}

const linkStatsService = new LinkStatsService();
export default linkStatsService;
