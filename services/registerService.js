const bcrypt = require("bcrypt");
const userRepo = require("../database/repositories/userRepository");
const learnerRepo = require("../database/repositories/learnerRepository");

const registerLearner = async (
  fullname,
  email,
  password,
  phoneNumber,
  username
) => {
  try {
    const duplicate = await userRepo.findOneByEmail(email);

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

    const userCreated = await userRepo.createUser(newUser);

    const newLearner = {
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      enrolledCourses: [],
    };

    const learnerCreated = await learnerRepo.createLearner(newLearner);

    if (!userCreated || !learnerCreated) {
      return {
        status: 500,
        message: "Error creating learner",
      };
    }

    return {
      status: 201,
      message: "Learner created successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error creating learner",
    };
  }
};

module.exports = { registerLearner };
