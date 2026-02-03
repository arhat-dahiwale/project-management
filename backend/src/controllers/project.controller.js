// backend/src/constrollers/project.controller.js

import {
  createOrgProject,
  listOrgProjects,
  getOrgProjectById,
  updateOrgProject,
  deleteOrgProject,
} from "../services/project.service.js";


export async function createProject(req, res) {
  const userId = req.user.id;
  const { orgId } = req.params;
  const { name } = req.body;

  try {
    const project = await createOrgProject(userId, orgId, name);
    return res.status(201).json(project);
  } catch (err) {
    if (err?.code === "INVALID_PROJECT_NAME") {
      return res.status(400).json({ error: err.code });
    }

    if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
      return res.status(403).json({ error: err.code });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}


export async function listProjects(req, res) {
  const userId = req.user.id;
  const { orgId } = req.params;

  try {
    const projects = await listOrgProjects(userId, orgId);
    return res.json(projects);
  } catch (err) {
    if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
      return res.status(403).json({ error: err.code });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}


export async function getProject(req, res) {
  const userId = req.user.id;
  const { orgId, projectId } = req.params;

  try {
    const project = await getOrgProjectById(userId, orgId, projectId);
    return res.json(project);
  } catch (err) {
    if (err?.code === "PROJECT_NOT_FOUND") {
      return res.status(404).json({ error: err.code });
    }

    if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
      return res.status(403).json({ error: err.code });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}


export async function updateProject(req, res) {
  const userId = req.user.id;
  const { orgId, projectId } = req.params;
  const { name } = req.body;

  try {
    const updated = await updateOrgProject(userId, orgId, projectId, name);
    return res.json(updated);
  } catch (err) {
    if (err?.code === "INVALID_PROJECT_NAME") {
      return res.status(400).json({ error: err.code });
    }

    if (err?.code === "PROJECT_NOT_FOUND") {
      return res.status(404).json({ error: err.code });
    }

    if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
      return res.status(403).json({ error: err.code });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}


export async function deleteProject(req, res) {
  const userId = req.user.id;
  const { orgId, projectId } = req.params;

  try {
    await deleteOrgProject(userId, orgId, projectId);
    return res.status(204).end();
  } catch (err) {
    if (err?.code === "PROJECT_NOT_FOUND") {
      return res.status(404).json({ error: err.code });
    }

    if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
      return res.status(403).json({ error: err.code });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}