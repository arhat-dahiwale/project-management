// authorization.service.js
import {getMembership} from "../repositories/membership.repository.js";

export async function requireOrgRole(userId, orgId, allowedRoles) {
    const membership = await getMembership(userId,orgId);

    if (!membership) {
        throw { code: "NOT_A_MEMBER" };

    }

    if (!allowedRoles.includes(membership.role)) {
        throw { code: "INSUFFICIENT_ROLE" };
    }

    return membership;
}