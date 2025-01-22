import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to register a new user
router.post("/register", async (req, res) => {
  try {
    // Destructure request body to get user details
    const { username, email, password } = req.body;

    // Generate salt and hash the password before storing
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user with hashed password and a generated access token
    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      id: user._id,
      accessToken: user.accessToken,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not create user",
      error: error.message,
    });
  }
});

// Route to login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email in the database
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        success: true,
        message: "Login successful",
        id: user._id,
        accessToken: user.accessToken,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

// Get user profile (protected route)
router.get("/profile", authenticateUser, (req, res) => {
  res.json({
    success: true,
    user: {
      username: req.user.username,
      email: req.user.email,
    },
  });
});

// Route to get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
