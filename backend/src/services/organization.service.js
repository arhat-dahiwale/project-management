// backend/src/services/organization.service.js

import {
  createOrganization,
  getOrganizationById,
  updateOrganization,
} from "../repositories/organization.repository.js";
import { listUserOrganizations, addMemberToOrg} from "../repositories/membership.repository.js";
import { requireOrgRole } from "./authorization.service.js";


export async function createOrg(userId, name) {
    if (!name || typeof name !== "string") {
        throw { code: "INVALID_ORG_NAME" };
    }

    const org = await createOrganization(name);
    await addMemberToOrg(userId, org.id, "admin");

    return org;
}

export async function listOrgsForUser(userId) {
    return listUserOrganizations(userId);
}

export async function getOrgById(userId, orgId) {
    await requireOrgRole(userId, orgId, ["admin", "member"]);

    const org = await getOrganizationById(orgId);

    if (!org) {
        throw { code: "ORG_NOT_FOUND" };
    }

    return org;
}

export async function updateOrg(userId, orgId, name) {
    if (!name || typeof name !== "string") {
        throw { code: "INVALID_ORG_NAME" };
    }

    await requireOrgRole(userId, orgId, ["admin"]);

    const updatedOrg = await updateOrganization(orgId, name);

    if (!updatedOrg) {
        throw { code: "ORG_NOT_FOUND" };
    }

    return updatedOrg;
}