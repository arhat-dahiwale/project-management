// backend/src/routes/project.routes.js

import express from "express";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", createProject);
router.get("/", listProjects);
router.get("/:projectId", getProject);
router.patch("/:projectId",updateProject);
router.delete("/:projectId", deleteProject);

export default router;
