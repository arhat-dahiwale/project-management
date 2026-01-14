// project.service.js
import { createProject, listProjects } from "../repositories/project.repository.js";
import { requireOrgRole } from "./authorization.service.js";

export async function createOrgProject(userId, orgId, name) {
    await requireOrgRole(userId,orgId,["admin"]);

    return createProject(orgId,name);
}

export async function listOrgProjects(userId, orgId) {
    await requireOrgRole(userId,orgId,["admin","member"]);

    return listProjects(orgId);
}