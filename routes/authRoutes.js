const express = require("express");
const {
  handleLogin,
  handleLogout,
  handleRefreshToken,
} = require("../controllers/authController.js");

const router = express.Router();

//Login
router.post("/login", handleLogin);

//Logout
router.post("/logout", handleLogout);

//Refresh token
router.post("/refresh", handleRefreshToken);

module.exports = router;
