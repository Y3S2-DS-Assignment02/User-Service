// userController.js

const userService = require('../services/userService');

// Controller function to get user email and phoneNumber by user ID
exports.getUserDetailsById = async (req, res) => {
  const userId = req.params.userId;

  console.log("req",req.params)

  try {
        const userDetails = await userService.getUserDetailsById(userId);
// Call the service function to get user details

    if (!userDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the response with only email and phoneNumber
    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
