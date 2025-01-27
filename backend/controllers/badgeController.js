import Badge from "../models/Badge.js";

// Fetch all badges
export const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.status(200).json(badges);
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ message: "Failed to fetch badges." });
  }
};

// Add a new badge
export const createBadge = async (req, res) => {
  const { name, description, icon, unlockedAt } = req.body;
  try {
    const newBadge = new Badge({ name, description, icon, unlockedAt });
    await newBadge.save();
    res.status(201).json(newBadge);
  } catch (error) {
    console.error("Error creating badge:", error);
    res.status(500).json({ message: "Failed to create badge." });
  }
};
