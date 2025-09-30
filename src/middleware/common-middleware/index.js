import express from "express";

import { errorHandler } from "./error-handler.js";
import { invalidRouteHandler } from "./invalid-route-handler.js";

export const setupMiddleware = (app, appRouter) => {
  app.use(express.json());

  app.use((request, _response, next) => {
    const host = request.headers.host; // e.g. acme.yourapp.com
    const subdomain = host.split(".")[0];
    request.tenantSubdomain = subdomain;
    next();
  });

  app.use(appRouter);

  app.use(invalidRouteHandler);

  app.use(errorHandler);
};
