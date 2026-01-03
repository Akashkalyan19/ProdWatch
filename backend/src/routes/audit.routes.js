const express = require("express");
const { getAudits } = require("../controllers/audit.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", authMiddleware, requireRole("owner"), getAudits);

module.exports = router;
