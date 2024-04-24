const Instructor = require("../models/InstructorModel");

const createInstructor = async (instructor) => {
  try {
    const newInstructor = new Instructor(instructor);
    return await newInstructor.save();
  } catch (error) {
    console.log(error);
    throw new Error("Error creating instructor");
  }
};

module.exports = { createInstructor };
