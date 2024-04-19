const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../database/models/userModel");
const userRepo = require("../database/repositories/userRepository");

const loginUser = async (email, password) => {
  try {
    if (!email || !password)
      return {
        status: 400,
        message: "Email and password are required!",
      };
    const foundUser = await userRepo.findOneByEmail(email);

    if (!foundUser)
      return {
        status: 401,
        message: "User not found!",
      };
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const role = foundUser.role;
      // create JWTs
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            role: role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "300s" }
      );
      const refreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      // Saving refreshToken with current user
      const updatedUser = await userRepo.updateRefreshToken(
        foundUser._id,
        refreshToken
      );
      if (updatedUser) {
        return {
          accessToken,
          refreshToken,
          role,
          status: 200,
          message: "Logged in successfully!",
        };
      }
    } else {
      return {
        status: 401,
        message: "Invalid password!",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Error logging in",
    };
  }
};

module.exports = { loginUser };
