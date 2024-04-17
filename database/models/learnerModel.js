const mongoose = require("mongoose");

const learnerSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    enrolledCourses: [
      {
        type: String,
      },
    ],
    phoneNumber: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Learner = mongoose.model("Learner", learnerSchema);

module.exports = Learner;
