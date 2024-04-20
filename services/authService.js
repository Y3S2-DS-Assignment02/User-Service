const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

const logoutUser = async (reqCookies) => {
  try {
    const cookies = reqCookies;
    if (!cookies?.jwt)
      return {
        status: 204,
        message: "No user found with this token",
      };
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await userRepo.findOneByRefreshToken(refreshToken);
    if (!foundUser) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    // Delete refreshToken in db
    const updatedUser = await userRepo.updateRefreshTokenToNull(foundUser._id);

    if (updatedUser) {
      return {
        status: 200,
        message: "Logged out successfully",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Something went wrong. Please try again.",
    };
  }
};

module.exports = { loginUser, logoutUser };