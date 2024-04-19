const Learner = require("../models/learnerModel");

const createLearner = async (session, learner, transactionOptions) => {
  try {
    const newLearner = new Learner(learner);
    return await newLearner.save({ session, ...transactionOptions });
  } catch (error) {
    console.log(error);
    throw new Error("Error creating learner");
  }
};

module.exports = { createLearner };
