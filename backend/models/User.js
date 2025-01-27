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
});

const User = mongoose.model("User", UserSchema);

export default User;
