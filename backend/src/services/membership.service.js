// backend/src/services/membership.service.js

import { requireOrgRole } from "./authorization.service.js";
import {
  getMembership,
  listOrgMembers,
  addMemberToOrg,
  removeMemberFromOrg,
  getUserByEmail,
} from "../repositories/membership.repository.js";

export async function addMemberToOrganization(requestingUserId,orgId,email,role) {
    await requireOrgRole(requestingUserId, orgId, ["admin"]);

    if (!["admin", "member"].includes(role)) {
        throw { code: "INVALID_ROLE" };
    }

    const user = await getUserByEmail(email);
    if (!user) {
        throw { code: "USER_NOT_FOUND" };
    }

    const existingMembership = await getMembership(user.id, orgId);
    if (existingMembership) {
        throw { code: "ALREADY_A_MEMBER" };
    }

    return addMemberToOrg(user.id,orgId,role);
}


export async function listOrganizationMembers(requestingUserId, orgId) {
  await requireOrgRole(requestingUserId, orgId, ["admin", "member"]);

  return listOrgMembers(orgId);
}

export async function removeMemberFromOrganization(requestingUserId,orgId,targetUserId) {

    if (requestingUserId === targetUserId) {
        const membership = await getMembership(requestingUserId, orgId);
        if (!membership) {
            throw { code: "MEMBERSHIP_NOT_FOUND" };
        }

        if (membership.role === "admin") {
            const allMembers = await listOrgMembers(orgId);
            const adminCount = allMembers.filter(m => m.role === "admin").length;

            if (adminCount <= 1) {
                throw { code: "CANNOT_LEAVE_AS_LAST_ADMIN" };
            }
        }
        const removed = await removeMemberFromOrg(requestingUserId, orgId);
        if (!removed) throw { code: "MEMBERSHIP_NOT_FOUND" };
        
        return undefined;
    }

    await requireOrgRole(requestingUserId, orgId, ["admin"]);

    const removed = await removeMemberFromOrg(targetUserId, orgId);

    if (!removed) {
        throw { code: "MEMBERSHIP_NOT_FOUND" };
    }

    return undefined;
}