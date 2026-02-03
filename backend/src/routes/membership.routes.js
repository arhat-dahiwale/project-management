// backend/src/routes/membership.routes.js

import express from "express";
import {
  addMember,
  listMembers,
  removeMember,
} from "../controllers/membership.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/",addMember);
router.get("/", listMembers);
router.delete("/:userId", removeMember);

export default router;
