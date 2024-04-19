const { loginUser } = require("../services/loginService");

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await loginUser(email, password);
    res.cookie("jwt", response.refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res
      .status(response.status)
      .send({
        data: { token: response.accessToken },
        message: response.message,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error logging in");
  }
};

module.exports = { handleLogin };
