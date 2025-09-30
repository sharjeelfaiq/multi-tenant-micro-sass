import { IS_PROD_ENV } from "#constants/index.js";

export const errorHandler = async (error, _request, response, _next) => {
  const status = error.statusCode || error.status || 500;
  const message = error.message || "Internal Server Error";
  const stack = error.stack || "No stack trace available";

  const responseBody = {
    status: "error",
    message,
    ...(IS_PROD_ENV ? {} : { stack }),
  };

  console.log(JSON.stringify(responseBody, null, 2));

  response.status(status).json(responseBody);
};
