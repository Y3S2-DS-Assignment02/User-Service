const jwt = require("jsonwebtoken");

const generateAccessToken = (email, role) => {
  return jwt.sign(
    {
      UserInfo: {
        email: email,
        role: role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "300s" }
  );
};

const generateRefreshToken = (email) => {
  return jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
