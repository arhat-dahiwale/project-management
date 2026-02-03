// backend/src/controllers/organization.controller.js

import {
  createOrg,
  listOrgsForUser,
  getOrgById,
  updateOrg,
} from "../services/organization.service.js";

export async function createOrganization(req, res) {
  const userId = req.user.id;
  const { name } = req.body;

  try {
    const org = await createOrg(userId, name);
    return res.status(201).json(org);
  } catch (err) {
    if (err?.code === "INVALID_ORG_NAME") {
      return res.status(400).json({ error: err.code });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}

export async function listOrganizations(req, res) {
  const userId = req.user.id;

  try {
    const orgs = await listOrgsForUser(userId);
    return res.json(orgs);
  } catch {
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}

export async function getOrganization(req, res) {
  const userId = req.user.id;
  const { orgId } = req.params;

  try {
    const org = await getOrgById(userId, orgId);
    return res.json(org);
  } catch (err) {
    if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
      return res.status(403).json({ error: err.code });
    }

    if (err?.code === "ORG_NOT_FOUND") {
      return res.status(404).json({ error: err.code });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}

export async function updateOrganization(req, res) {
  const userId = req.user.id;
  const { orgId } = req.params;
  const { name } = req.body;

  try {
    const updated = await updateOrg(userId, orgId, name);
    return res.json(updated);
  } catch (err) {
    if (err?.code === "INVALID_ORG_NAME") {
      return res.status(400).json({ error: err.code });
    }

    if (err?.code === "NOT_A_MEMBER" || err?.code === "INSUFFICIENT_ROLE") {
      return res.status(403).json({ error: err.code });
    }

    if (err?.code === "ORG_NOT_FOUND") {
      return res.status(404).json({ error: err.code });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}
