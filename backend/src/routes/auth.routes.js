// backend/src/routes/auth.routes.js
import express from "express";
import {login, register, getMe} from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",login);
router.get("/me", authMiddleware, getMe);

export default router;