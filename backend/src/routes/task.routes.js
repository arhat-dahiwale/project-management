// task.routes.js

import express from "express";
import { getTasks,updateTask,removeTask,createTask } from "../controllers/task.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/tasks",authMiddleware, getTasks);
router.post("/tasks",authMiddleware, createTask);
router.put("/tasks/:taskId",authMiddleware,updateTask);
router.delete("/tasks/:taskId",authMiddleware, removeTask);

export default router;

