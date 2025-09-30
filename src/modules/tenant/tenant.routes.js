import express from "express";

import { tenantControllers } from "./tenant.controllers.js";
import { validateMiddleware as validate } from "#middleware/index.js";

export const tenantRoutes = express.Router();

tenantRoutes
  .get("/:id", validate.authRole("admin"), tenantControllers.getById)
  .patch("/:id", validate.authRole("admin"), tenantControllers.updateById)
