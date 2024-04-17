const express = require("express");
const registerController = require("../controllers/registerController");

const router = express.Router();

//Register a new learner
router.post("/register-learner", registerController.registerUserLearner);

module.exports = router;
