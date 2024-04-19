const express = require("express");
const { handleLogin } = require("../controllers/loginController");

const router = express.Router();

//Login
router.post("/login", handleLogin);

module.exports = router;
