// backend/src/controllers/membership.controller.js

import {
  addMemberToOrganization,
  listOrganizationMembers,
  removeMemberFromOrganization,
} from "../services/membership.service.js";

export async function addMember(req, res) {
  const requestingUserId = req.user.id;
  const { orgId } = req.params;
  const { email, role } = req.body;

  try {
    const membership = await addMemberToOrganization(
      requestingUserId,
      orgId,
      email,
      role
    );
    return res.status(201).json(membership);
  } catch (err) {
    if (err?.code === "INVALID_ROLE") {
      return res.status(400).json({ error: err.code });
    }

    if (err?.code === "USER_NOT_FOUND") {
      return res.status(404).json({ error: err.code });
    }

    if (err?.code === "ALREADY_A_MEMBER") {
      return res.status(409).json({ error: err.code });
    }

    if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
      return res.status(403).json({ error: err.code });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}

export async function listMembers(req, res) {
  const requestingUserId = req.user.id;
  const { orgId } = req.params;

  try {
    const members = await listOrganizationMembers(requestingUserId, orgId);
    return res.json(members);
  } catch (err) {
    if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
      return res.status(403).json({ error: err.code });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}

export async function removeMember(req, res) {
  const requestingUserId = req.user.id;
  const { orgId, userId } = req.params;

  try {
    await removeMemberFromOrganization(
      requestingUserId,
      orgId,
      userId
    );
    return res.status(204).end();
  } catch (err) {
    if (err?.code === "CANNOT_REMOVE_SELF") {
      return res.status(400).json({ error: err.code });
    }

    if (err?.code === "MEMBERSHIP_NOT_FOUND") {
      return res.status(404).json({ error: err.code });
    }

    if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
      return res.status(403).json({ error: err.code });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}
