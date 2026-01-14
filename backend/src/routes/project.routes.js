// project.routes.js
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createProject, listProjects } from "../controllers/project.controller.js";

const router = express.Router();

router.post("/:orgId/projects",authMiddleware,createProject);
router.get("/:orgId/projects", authMiddleware,listProjects);

export default router; 