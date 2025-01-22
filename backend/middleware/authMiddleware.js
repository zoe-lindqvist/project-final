import User from "../models/User.js";

// Middleware function to authenticate users based on their access token
export const authenticateUser = async (req, res, next) => {
  try {
    // Get the access token from the request headers
    const accessToken = req.header("Authorization");

    // Find user by access token
    const user = await User.findOne({ accessToken });

    if (user) {
      // If user is found, attach the user object to the request
      req.user = user;
      next();
    } else {
      res.status(401).json({
        success: false,
        loggedOut: true,
        message: "Access denied",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
