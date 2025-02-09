/**
 * Badge Routes - Manages badge-related API operations.
 *
 * - GET  /api/badges  → Retrieve all badges.
 * - POST /api/badges  → Create a new badge.
 *
 * Uses Mongoose for database interactions and includes basic error handling.
 */

import express from "express";
import Badge from "../models/Badge.js";
import { User } from "../models/User.js";

const router = express.Router();

// GET /api/badges - Fetch all badges
router.get("/", async (req, res) => {
  try {
    const badges = await Badge.find();
    res.status(200).json(badges);
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ message: "Failed to fetch badges." });
  }
});

// POST /api/badges - Create a new badge
router.post("/", async (req, res) => {
  const { id, name, description, icon, unlockedAt } = req.body;
  try {
    const newBadge = new Badge({ id, name, description, icon, unlockedAt });
    await newBadge.save();
    res.status(201).json(newBadge);
  } catch (error) {
    console.error("Error creating badge:", error);
    res.status(500).json({ message: "Failed to create badge." });
  }
});

// POST /api/badges/unlock
router.post("/unlock", async (req, res) => {
  const { userId, badgeId } = req.body;

  try {
    const badge = await Badge.findOne({ id: badgeId });
    if (!badge) {
      return res.status(404).json({ message: "Badge not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the badge is already unlocked
    const alreadyUnlocked = user.badges.some((b) => b._id.equals(badge._id));
    if (alreadyUnlocked) {
      return res.status(200).json({ message: "Badge already unlocked" });
    }

    // Add the badge to the user's badges
    user.badges.push(badge);
    await user.save();

    res.status(201).json({ message: "Badge unlocked", badge });
  } catch (error) {
    console.error("Error unlocking badge:", error);
    res.status(500).json({ message: "Failed to unlock badge" });
  }
});

export default router;
