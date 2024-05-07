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
  const session = await mongoose.startSession();
  session.startTransaction();
  const transactionOptions = { session };

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

    await userRepo.createUser(session, newUser, transactionOptions);

    const newLearner = {
      userId: userCreated._id,
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      enrolledCourses: [],
      progression: [],
    };

    await learnerRepo.createLearner(session, newLearner, transactionOptions);

    if (!userCreated || !learnerCreated) {
      return {
        status: 500,
        message: "Error creating learner",
      };
    }

    const accessToken = generateAccessToken(newUser.email, newUser.role);

    return {
      status: 201,
      userId: userCreated._id,
      token: accessToken,
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

const registerInstructor = async (
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
      role: "Instructor",
      refreshToken: "",
    };

    const userCreated = await userRepo.createUser(newUser);

    const newInstructor = {
      userId: userCreated._id,
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      username,
      bankDetails: {},
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
      userId: userCreated._id,
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
