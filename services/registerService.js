const bcrypt = require("bcrypt");
const userRepo = require("../database/repositories/userRepository");
const learnerRepo = require("../database/repositories/learnerRepository");
const instructorRepo = require("../database/repositories/instructorRepository");
const { generateAccessToken } = require("../helpers/jwt");

const registerLearner = async (
  fullname,
  email,
  password,
  phoneNumber,
  username
) => {
  try {
    const duplicate = await findDuplicateUser(email);

    if (duplicate) {
      return duplicate;
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

    const accessToken = generateAccessToken(newUser.email, newUser.role);

    return {
      status: 201,
      token: accessToken,
      message: "Learner created successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error creating learner",
    };
  }
};

const registerInstructor = async (
  fullname,
  email,
  password,
  phoneNumber,
  username,
  bankDetails
) => {
  try {
    const duplicate = await findDuplicateUser(email);

    if (duplicate) {
      return duplicate;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      role: "Instructor",
      refreshToken: "",
    };

    const userCreated = await userRepo.createUser(newUser);

    const newInstructor = {
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      bankDetails,
      courses: [],
    };

    const instructorCreated = await instructorRepo.createInstructor(
      newInstructor
    );

    if (!userCreated || !instructorCreated) {
      return {
        status: 500,
        message: "Error creating instructor",
      };
    }

    const accessToken = generateAccessToken(newUser.email, newUser.role);

    return {
      status: 201,
      token: accessToken,
      message: "Instructor created successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error creating instructor",
    };
  }
};

const findDuplicateUser = async (email) => {
  const duplicate = await userRepo.findOneByEmail(email);

  if (duplicate) {
    return {
      status: 400,
      message: "User with this email already exists",
    };
  }

  return null;
};

module.exports = { registerLearner, registerInstructor };
