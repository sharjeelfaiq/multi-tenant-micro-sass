import express from "express";

import { kpiControllers } from "./kpi.controllers.js";

export const kpiRoutes = express.Router();

kpiRoutes
  .get("/get-by-tenant-id", kpiControllers.getByTenantId)
