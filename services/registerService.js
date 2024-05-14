const bcrypt = require("bcrypt");
const userRepo = require("../database/repositories/userRepository");
const learnerRepo = require("../database/repositories/learnerRepository");
const instructorRepo = require("../database/repositories/instructorRepository");
const { generateAccessToken } = require("../helpers/jwt");
const {sendEmail_Registraion} = require('./external/emailService')
const {sendSMS_Registraion} = require('./external/smsService')

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

    const userCreated = await userRepo.createUser( newUser);
    const newLearner = {
      userId: userCreated._id,
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      enrolledCourses: [],
      progression: [],
    };

    const learnerCreated = await learnerRepo.createLearner( newLearner);

    if (!userCreated || !learnerCreated) {
      return {
        status: 500,
        message: "Error creating learner",
      };
    }

    const accessToken = generateAccessToken(newUser.email, newUser.role);
    await sendEmail_Registraion(newUser.email);
    await sendSMS_Registraion(phoneNumber);
    return {
      status: 201,
      userId: userCreated._id,
      token: accessToken,
      role: userCreated.role,
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
    await sendEmail_Registraion(newUser.email);
    await sendSMS_Registraion(phoneNumber);

    return {
      status: 201,
      token: accessToken,
      userId: userCreated._id,
      role: userCreated.role,
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
