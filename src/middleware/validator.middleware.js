import createError from "http-errors";

import { tokenUtils } from "#utils/index.js";

export const validateMiddleware = {
  accessToken: (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Authorization token missing or malformed.");
    }

    const accessToken = authHeader.split(" ")[1]; // Get token after 'Bearer '

    const decodedToken = tokenUtils.decode(accessToken);

    req.user = decodedToken;

    next();
  },

  authRole: (authorizedRole) => (req, _res, next) => {
    if (!req.user) {
      throw createError(401, "Authentication required.");
    }

    if (req.user.role !== authorizedRole) {
      throw createError(403, `Access denied: ${authorizedRole} role required.`);
    }

    next();
  },
};




