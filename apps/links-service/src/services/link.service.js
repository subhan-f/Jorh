import LinkModel from "../models/link.model.js";
import linkPublisher from "./publishers/link.publisher.js";

class LinkService {
  getLinks = async (userId) => {
    return LinkModel.find({ user: userId });
  };

  getLink = async (slug, userId) => {
    return LinkModel.findOne({ slug, user: userId });
  };

  createLink = async ({ originalUrl, tags = [], title = null, expiresAt, userId }) => {
    const link = await LinkModel.create({
      originalUrl,
      title,
      tags,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      user: userId,
    });

    await linkPublisher.publishCreatedLink({
      slug: link.slug,
      originalUrl: link.originalUrl,
      expiresAt: link.expiresAt,
      userId,
    });

    return link;
  };

  updateLink = async (slug, userId, newData) => {
    const link = await LinkModel.findOneAndUpdate({ slug, user: userId }, newData, { returnDocument: "after" });
    if (!link) throw new Error("Link not found");

    await linkPublisher.publishUpdatedLink({
      slug,
      originalUrl: link.originalUrl,
      expiresAt: link.expiresAt,
      userId,
    });

    return link;
  };

  deleteLink = async (slug, userId) => {
    await LinkModel.findOneAndDelete({ slug, user: userId });
    await linkPublisher.publishDeletedLink({ slug, userId });
    return { message: "Link deleted successfully" };
  };
}

const linkService = new LinkService();
export default linkService;
