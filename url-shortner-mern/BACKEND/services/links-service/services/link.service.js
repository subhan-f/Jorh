import LinkModel from "../models/link.model.js";
import rMQService from "./rabbitMQ.service.js";

class LinkService {
  getLinks = async (userId) => {
    const links = await LinkModel.find({ user: userId });
    return links;
  };

  getLink = async (slug, userId) => {
    const link = await LinkModel.findOne({ slug, user: userId });
    return link;
  };

  createLink = async ({ originalUrl, tags = [], title = null, expiresAt = null, userId }) => {
    console.log(`Original Url (service): ${originalUrl}`);

    const link = await LinkModel.create({
      originalUrl,
      title,
      tags,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      user: userId,
    });

    await rMQService.publishCreatedLink({
      slug: link.slug,
      originalUrl: link.originalUrl,
      expiresAt: link.expiresAt,
    });

    return link;
  };

  updateLink = async (slug, userId, newData) => {
    const link = await LinkModel.findOneAndUpdate({ slug, user: userId }, newData, {
      new: true,
    });
    if (!link) {
      throw new Error("Link not found");
    }

    await rMQService.publishUpdatedLink({
      slug,
      originalUrl: link.originalUrl,
      expiresAt: link.expiresAt,
    });

    return link;
  };

  deleteLink = async (slug, userId) => {
    await LinkModel.findOneAndDelete({ slug, user: userId });

    await rMQService.publishDeletedLink({ slug, user: userId });

    return { message: "Link deleted successfully" };
  };
}

const linkService = new LinkService();
export default linkService;
