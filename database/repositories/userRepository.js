const User = require("./../models/userModel");

const createUser = async (session, user, transactionOptions) => {
  try {
    const newUser = new User(user);
    return await newUser.save({ session, ...transactionOptions });
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user");
  }
};

const findOneByEmail = async (session, email) => {
  try {
    return await User.findOne({ email }).session(session);
  } catch (error) {
    console.log(error);
    throw new Error("Error finding user");
  }
};

module.exports = { createUser, findOneByEmail };
