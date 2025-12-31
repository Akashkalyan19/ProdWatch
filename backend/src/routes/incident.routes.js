const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const incController = require("../controllers/incident.controller");

router.get("/", authMiddleware, incController.getAllInc);

router.get("/:id", authMiddleware, incController.getIncById);

router.post(
  "/",
  authMiddleware,
  requireRole("owner", "team_lead"),
  incController.createInc
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("owner", "team_lead", "engineer"),
  incController.updateInc
);

module.exports = router;
