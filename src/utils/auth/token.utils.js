import createError from "http-errors";
import jwt from "jsonwebtoken";

import { env } from "#config/index.js";

const { JWT_SECRET_KEY } = env;

export const tokenUtils = {
  generate: (payload, tokenType) => {
    const options = {
      algorithm: "HS256",
    };

    switch (tokenType) {
      case "accessToken":
        options.expiresIn = "30h";
        break;
      default:
        throw createError(400, "Invalid token type specified.");
    }

    if (!JWT_SECRET_KEY) {
      throw createError(500, "JWT secret key is not defined");
    }

    return jwt.sign(payload, JWT_SECRET_KEY, options);
  },

  verify: (token) => {
    if (!JWT_SECRET_KEY) {
      throw createError(500, "JWT secret key is not defined");
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      throw new Error("Invalid token format");
    }

    return decoded;
  },

  decode: (token) => {
    const decoded = jwt.decode(token);

    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      throw new Error("Invalid token format");
    }

    return decoded;
  },
};
