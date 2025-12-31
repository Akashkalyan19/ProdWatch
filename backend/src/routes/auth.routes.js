const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/register/organization",
  authMiddleware,
  authController.registerOrg
);
router.post("/register/user", authMiddleware, authController.registerUser);
router.post("/login", authController.login);

module.exports = router;
