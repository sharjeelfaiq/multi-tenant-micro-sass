import createError from "http-errors";

export const commonUtils = {
  // 🟡 For Express middleware or route handlers
  routesAsyncHandler: (fn) => async (request, response, next) => {
    try {
      await fn(request, response, next);
    } catch (error) {
      next(error);
    }
  },

  // 🔵 For general top-level async functions
  asyncHandler:
    (fn) =>
    async (...args) => {
      try {
        await fn(...args);
      } catch (error) {
        throw createError(500, error.message);
      }
    },
};
