const express = require("express");
const router = express.Router();
const orgController = require("../controllers/org.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

router.post(
  "/change_code",
  authMiddleware,
  requireRole("owner"),
  orgController.changeCode
);
router.get("/allMembers", authMiddleware, orgController.getAllMembers);

module.exports = router;
