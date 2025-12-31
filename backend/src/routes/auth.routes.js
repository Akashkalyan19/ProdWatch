const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
  "/register/organization",
  authController.registerOrg
);
router.post("/register/user", authController.registerUser);
router.post("/login", authController.login);

module.exports = router;
