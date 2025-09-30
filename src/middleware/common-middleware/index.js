import express from "express";
import cors from "cors";

import { errorHandler } from "./error-handler.js";
import { invalidRouteHandler } from "./invalid-route-handler.js";

export const setupMiddleware = (app, appRouter) => {
  app.use(express.json());

  app.use(cors({
    origin: "*",
  }));

  app.use((request, _response, next) => {
    const host = request.headers.host; // e.g. acme.yourapp.com or localhost:3000
    let subdomain = host.split(".")[0];

    // Handle localhost or missing subdomain
    if (host.startsWith("localhost") || host.split(".").length < 2) {
      subdomain = "default"; // your default subdomain
    }

    request.tenantSubdomain = subdomain;
    next();
  });

  app.use(appRouter);

  app.use(invalidRouteHandler);

  app.use(errorHandler);
};
