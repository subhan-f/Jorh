import { nanoid } from "nanoid";

export const generateShortId = (length) => {
  return nanoid(length);
};
