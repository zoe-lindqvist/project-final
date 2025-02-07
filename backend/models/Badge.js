/**
 * Badge Model
 * -------------------------------
 * Defines the schema for user badges in the database.
 * - `name`: Name of the badge.
 * - `description`: Short description of the badge.
 * - `icon`: URL or file reference for the badge icon.
 * - `unlockedAt`: Timestamp indicating when the badge was earned.
 */

import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  unlockedAt: { type: Date, required: true },
});

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;
