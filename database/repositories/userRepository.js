const User = require("./../models/userModel");

const createUser = async (user) => {
  try {
    const newUser = new User(user);
    const resp = await newUser.save();
    return resp;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user");
  }
};

const findOneByEmail = async (email) => {
  try {
    const response = await User.findOne({ email });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error finding user");
  }
};

module.exports = { createUser, findOneByEmail };
