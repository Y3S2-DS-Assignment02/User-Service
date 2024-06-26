const {
  registerLearner,
  registerInstructor,
} = require("../services/registerService");

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
    if (response.status === 201) {
      res
        .status(response.status)
        .send({ data: {token: response.token, userId: response.userId, role: response.role}, message: response.message });
    } else {
      res.status(response.status).send({ data: {}, message: response.message });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating learner");
  }
};

const registerUserInstructor = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, username } = req.body;
    const response = await registerInstructor(
      fullname,
      email,
      password,
      phoneNumber,
      username
    );
    if (response.status === 201) {
      res
        .status(response.status)
        .send({ data: {token: response.token, userId: response.userId, role: response.role}, message: response.message });
    } else {
      res.status(response.status).send({ data: {}, message: response.message });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating instructor");
  }
};

module.exports = { registerUserLearner, registerUserInstructor };
