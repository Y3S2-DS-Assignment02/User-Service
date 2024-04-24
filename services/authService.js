const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../database/repositories/userRepository");
const { generateAccessToken, generateRefreshToken } = require("../helpers/jwt");

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
      const accessToken = generateAccessToken(foundUser.email, role);

      const refreshToken = generateRefreshToken(foundUser.email);

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

const logoutUser = async (cookies) => {
  try {
    const cookies = cookies;
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

const refreshAccessToken = async (cookies) => {
  try {
    if (!cookies?.jwt) return { status: 401, message: "Unauthorized" };
    const refreshToken = cookies.jwt;
    var accessToken = "";

    const foundUser = await userRepo.findOneByRefreshToken(refreshToken);
    if (!foundUser)
      return {
        status: 403,
        message: "Forbidden",
      };
    // evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.email !== decoded.email)
          return {
            status: 403,
            message: "Forbidden",
          };
        const role = foundUser.role;
        accessToken = jwt.sign(
          {
            UserInfo: {
              email: decoded.email,
              role: role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "300s" }
        );
      }
    );
    return {
      accessToken,
      status: 200,
      message: "Token refreshed successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Something went wrong. Please try again.",
    };
  }
};

module.exports = { loginUser, logoutUser, refreshAccessToken };
