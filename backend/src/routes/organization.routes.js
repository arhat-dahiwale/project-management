// backend/src/routes/organization.routes.js

import express from "express";
import {
  createOrganization,
  listOrganizations,
  getOrganization,
  updateOrganization,
} from "../controllers/organization.controller.js";

const router = express.Router();

router.post("/",createOrganization);
router.get("/", listOrganizations);
router.get("/:orgId", getOrganization);
router.patch("/:orgId", updateOrganization);

export default router;
