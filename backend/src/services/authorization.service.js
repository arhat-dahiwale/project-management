import {getMembership} from "../repositories/membership.repository.js";

export async function requireOrgRole(userId, orgId, allowedRoles) {
    const membership = getMembership(userId,orgId);

    if (!membership) {
        throw new Error("NOT_A_MEMBER");
    }

    if (!allowedRoles.includes(membership.role)) {
        throw new Error("INSUFFICIENT_ROLE");
    }

    return membership;
}