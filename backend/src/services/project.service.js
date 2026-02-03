// backend/src/services/project.service.js
import {
  createProject,
  listProjectsByOrg,
  getProjectById,
  updateProject,
  deleteProject,
} from "../repositories/project.repository.js";
import { requireOrgRole } from "./authorization.service.js";
import {
  listTasksByProject,
  deleteTask,
} from "../repositories/task.repository.js";


export async function createOrgProject(userId, orgId, name) {
  if (!name || typeof name !== "string") {
    throw { code: "INVALID_PROJECT_NAME" };
  }

  await requireOrgRole(userId, orgId, ["admin"]);

  return createProject(orgId, name);
}

export async function listOrgProjects(userId, orgId) {
  await requireOrgRole(userId, orgId, ["admin", "member"]);

  return listProjectsByOrg(orgId);
}


export async function getOrgProjectById(userId, orgId, projectId) {
  await requireOrgRole(userId, orgId, ["admin", "member"]);

  const project = await getProjectById(projectId);
  if (!project || project.organization_id !== orgId) {
    throw { code: "PROJECT_NOT_FOUND" };
  }

  return project;
}

export async function updateOrgProject(userId, orgId, projectId, name) {
  if (!name || typeof name !== "string") {
    throw { code: "INVALID_PROJECT_NAME" };
  }

  await requireOrgRole(userId, orgId, ["admin"]);

  const project = await getProjectById(projectId);
  if (!project || project.organization_id !== orgId) {
    throw { code: "PROJECT_NOT_FOUND" };
  }

  const updated = await updateProject(projectId, name);
  if (!updated) {
    throw { code: "PROJECT_NOT_FOUND" };
  }

  return updated;
}

export async function deleteOrgProject(userId, orgId, projectId) {
  await requireOrgRole(userId, orgId, ["admin"]);

  const project = await getProjectById(projectId);

  if (!project || project.organization_id !== orgId) {
    throw { code: "PROJECT_NOT_FOUND" };
  }


  const deleted = await deleteProject(projectId);
  if (!deleted) {
    throw { code: "PROJECT_NOT_FOUND" };
  }

  return undefined;
}