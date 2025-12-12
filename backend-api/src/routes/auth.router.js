const express = require("express");

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validateMiddleware");
const { registerSchema, loginSchema } = require("../schemas/auth.schema");

const router = express.Router();

module.exports.setup = (app) => {
  app.use("/api/auth", router);

  // Login route
  router.post("/login", validate(loginSchema), authController.login);

  // Register route
  router.post("/register", validate(registerSchema), authController.register);

  // Logout route
  router.post("/logout", authController.logout);

  // Refresh token route
  router.post("/refresh", authController.refresh);

  // Request password reset
  router.post("/req_reset", authController.requestReset);

  // Reset password
  router.post("/reset_pwd", authController.resetPassword);
};
