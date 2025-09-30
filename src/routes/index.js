import express from "express";

import { authRoutes, tenantRoutes, kpiRoutes, ultraVoxRoutes } from "#modules/index.js";
import { validateMiddleware as validate } from "#middleware/index.js";

const appRouter = express.Router();

appRouter.use("/health", (request, response) => {
    return response.json({ message: "OK" });
})

appRouter.use("/auth", authRoutes);
appRouter.use("/kpis", validate.accessToken, kpiRoutes);
appRouter.use("/tenants", validate.accessToken, tenantRoutes);
appRouter.use("/ultravox", validate.accessToken, ultraVoxRoutes);

export default appRouter;
