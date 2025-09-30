import express from "express";

import { ultraVoxControllers } from "./ultra-vox.controllers.js";

export const ultraVoxRoutes = express.Router();

ultraVoxRoutes
    .get("/test", ultraVoxControllers.test)
