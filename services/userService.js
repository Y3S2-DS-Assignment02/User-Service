const Learner = require('../database/models/learnerModel');



exports.getUserDetailsById = async (userId) => {

  console.log(userId)
  try {
    
    const user = await Learner.findOne({userId:userId});
    console.log(user)
    return user;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw new Error('Internal server error');
  }
};