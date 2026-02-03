// backend/src/routes/task.routes.js

import express from "express";
import { getTasks,updateTask,removeTask,createTask } from "../controllers/task.controller.js";

const router = express.Router({ mergeParams: true });


router.get("/",getTasks);
router.post("/", createTask);
router.patch("/:taskId",updateTask);
router.delete("/:taskId", removeTask);

export default router;

