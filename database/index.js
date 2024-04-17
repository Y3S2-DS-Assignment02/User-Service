const mongoose = require("mongoose");
require("dotenv").config();

exports.connectToDatabase = async () => {
  try {
    const url = process.env.MONGODB_URI || "mongodb://localhost:27017";

    await mongoose.connect(url, {});

    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};
