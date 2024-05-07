const Learner = require("../models/learnerModel");

const createLearner = async ( learner) => {
  try {
    const newLearner = new Learner(learner);
    return await newLearner.save();
  } catch (error) {
    console.log(error);
    throw new Error("Error creating learner");
  }
};

module.exports = { createLearner };
