/**
 * User Routes - Manages user authentication, profiles, and social interactions.
 *
 * Endpoints:
 *  - POST /register       → Register a new user.
 *  - POST /login          → Authenticate user and return access token.
 *  - GET /profile         → Retrieve the logged-in user's profile (protected).
 *  - POST /follow/:id     → Follow another user (protected).
 *  - POST /unfollow/:id   → Unfollow a user (protected).
 *  - GET /users           → Retrieve a list of all users.
 *  - GET /search          → Search users by username (case insensitive).
 *  - GET /:id             → Get a specific user profile by ID (protected).
 *  - PATCH /:id/badges    → Unlock a badge for a user.
 *
 * Features:
 *  - Uses Mongoose for database interactions.
 *  - Hashes passwords using bcrypt for security.
 *  - Includes authentication middleware for protected routes.
 *  - Allows following/unfollowing users.
 *  - Supports user profile lookup and badge unlocking.
 */

import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";
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
      id: user.id,
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
        id: user.id,
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

// Follow a user
router.post("/follow/:id", authenticateUser, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate follow
    if (!currentUser.following.includes(userToFollow.id)) {
      currentUser.following.push(userToFollow.id);
      userToFollow.followers.push(currentUser.id);
      await currentUser.save();
      await userToFollow.save();
      res.json({ message: `You are now following ${userToFollow.username}` });
    } else {
      res.status(400).json({ message: "Already following this user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unfollow a user
router.post("/unfollow/:id", authenticateUser, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from following and followers lists
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser.id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();
    res.json({ message: `You have unfollowed ${userToUnfollow.username}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

// Search users by username
router.get("/search", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res
        .status(400)
        .json({ message: "Username query parameter is required" });
    }

    const users = await User.find({
      username: { $regex: new RegExp(username, "i") },
    }).select("username email");

    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching users", error: error.message });
  }
});

// Get a user profile by ID
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("badges")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Transform `_id` to `id` for the user
    user.id = user._id.toString();
    delete user._id;

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
});

//  PATCH - Unlock a badge for a user
router.patch("/:id/badges", async (req, res) => {
  const { badgeId } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId); // Add badge ID to user's badges
      await user.save();
    }

    res.status(200).json(user.badges);
  } catch (error) {
    console.error("Error unlocking badge:", error);
    res.status(500).json({ message: "Failed to unlock badge." });
  }
});

export default router;
