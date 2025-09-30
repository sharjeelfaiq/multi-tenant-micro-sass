import express from "express";

import { authRoutes, tenantRoutes, kpiRoutes } from "#modules/index.js";
import { validateMiddleware as validate } from "#middleware/index.js";

const appRouter = express.Router();

appRouter.use("/auth", authRoutes);
appRouter.use("/kpis", validate.accessToken, kpiRoutes);
appRouter.use("/tenants", validate.accessToken, tenantRoutes);

export default appRouter;
