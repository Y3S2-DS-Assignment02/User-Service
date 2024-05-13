const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();


router.get("/getUserByID/:userId", userController.getUserDetailsById);



module.exports = router;
