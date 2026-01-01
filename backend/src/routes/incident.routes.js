const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const incController = require("../controllers/incident.controller");

router.get("/", authMiddleware, incController.getAllInc);

router.get("/:id", authMiddleware, incController.getIncById);

router.get("/:id/events", authMiddleware, incController.getIncidentEvents);

router.post(
  "/",
  authMiddleware,
  requireRole("owner", "team_lead"),
  incController.createInc
);
router.post(
  "/:id/message",
  authMiddleware,
  requireRole("owner", "team_lead", "engineer"),
  incController.addMessage
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("owner", "team_lead", "engineer"),
  incController.updateInc
);

module.exports = router;
