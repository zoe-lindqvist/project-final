import User from "../models/User.js";

// Middleware function to authenticate users based on their access token
export const authenticateUser = async (req, res, next) => {
  try {
    // Get the access token from the request headers
    let accessToken = req.header("Authorization");

    // Ensure token is present and formatted correctly
    if (!accessToken || !accessToken.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        loggedOut: true,
        message: "Access denied. No token provided.",
      });
    }

    // Remove "Bearer " prefix to get the actual token
    accessToken = accessToken.split(" ")[1];

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
