const express = require("express");
const {
  handleLogin,
  handleLogout,
} = require("../controllers/authController.js");

const router = express.Router();

//Login
router.post("/login", handleLogin);

//Logout
router.post("/logout", handleLogout);

module.exports = router;
