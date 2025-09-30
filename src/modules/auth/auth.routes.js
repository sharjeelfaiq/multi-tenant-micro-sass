import express from "express";

import { authControllers } from "./auth.controllers.js";

export const authRoutes = express.Router();

authRoutes
    .post("/signup", authControllers.signUp)
    .post("/signin",  authControllers.signIn);
