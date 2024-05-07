const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
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
    courses: [
      {
        type: String,
      },
    ],
    phoneNumber: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    bankDetails: {
      bankName: {
        type: String,
        required: false,
      },
      accountNumber: {
        type: String,
        required: false,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
