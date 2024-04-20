const { loginUser, logoutUser } = require("../services/authService");

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
    res.status(response.status).send({
      data: { token: response.accessToken },
      message: response.message,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error logging in");
  }
};

const handleLogout = async (req, res) => {
  try {
    const response = await logoutUser(req.cookies);
    if (response.status === 200) {
      res.clearCookie("jwt");
    }
    res.status(response.status).send({ data: {}, message: response.message });
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: {}, message: "Error logging out" });
  }
};

module.exports = { handleLogin, handleLogout };
