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

// Get a user profile by ID
router.get("/users/:id", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      following: user.following,
      followers: user.followers,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
});

// Follow a user
router.post("/follow/:id", authenticateUser, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate follow
    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
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
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from following and followers lists
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();
    res.json({ message: `You have unfollowed ${userToUnfollow.username}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's feed (posts from followed users)
router.get("/feed", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("following");
    const followingIds = user.following.map((user) => user._id);

    const feedEntries = await Entry.find({ userId: { $in: followingIds } })
      .sort({ createdAt: -1 }) // Show most recent first
      .populate("userId", "username");

    res.json(feedEntries);
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

export default router;
