const express = require("express");
const registerController = require("../controllers/registerController");

const router = express.Router();

//Register a new learner
router.post("/register-learner", registerController.registerUserLearner);

//Register a new instructor
router.post("/register-instructor", registerController.registerUserInstructor);

module.exports = router;
