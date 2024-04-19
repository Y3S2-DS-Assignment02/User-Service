const bcrypt = require("bcrypt");
const userRepo = require("../database/repositories/userRepository");
const learnerRepo = require("../database/repositories/learnerRepository");
const mongoose = require("mongoose");

const registerLearner = async (
  fullname,
  email,
  password,
  phoneNumber,
  username
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const transactionOptions = { session };

  try {
    const duplicate = await userRepo.findOneByEmail(session, email);

    if (duplicate) {
      return {
        status: 400,
        message: "User with this email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      role: "Learner",
      refreshToken: "",
    };

    await userRepo.createUser(session, newUser, transactionOptions);

    const newLearner = {
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      enrolledCourses: [],
    };

    await learnerRepo.createLearner(session, newLearner, transactionOptions);

    await session.commitTransaction();
    session.endSession();

    return {
      status: 201,
      message: "Learner created successfully",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return {
      status: 500,
      message: "Error creating learner",
    };
  }
};

module.exports = { registerLearner };
