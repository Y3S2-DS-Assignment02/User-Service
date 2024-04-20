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

const updateRefreshToken = async (userId, refreshToken) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { refreshToken: refreshToken },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    // Handle error, perhaps log it
    throw error;
  }
};

const findOneByRefreshToken = async (refreshToken) => {
  try {
    const user = await User.findOne({ refreshToken: refreshToken });
    return user;
  } catch (error) {
    // Handle error, perhaps log it
    throw error;
  }
};

const updateRefreshTokenToNull = async (userId) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { refreshToken: null },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    // Handle error, perhaps log it
    throw error;
  }
};

module.exports = {
  createUser,
  findOneByEmail,
  updateRefreshToken,
  findOneByRefreshToken,
  updateRefreshTokenToNull,
};
