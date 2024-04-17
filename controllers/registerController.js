const { registerLearner } = require("../services/registerService");

const registerUserLearner = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, username } = req.body;
    const response = await registerLearner(
      fullname,
      email,
      password,
      phoneNumber,
      username
    );
    res.status(response.status).send(response.message);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating learner");
  }
};

module.exports = { registerUserLearner };
