import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References other users they are following
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References users who follow them
    },
  ],
  streak: {
    type: Number,
    default: 0,
  },
  badges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
    },
  ],
});

// Transform _id to id
UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export const User = mongoose.model("User", UserSchema);
