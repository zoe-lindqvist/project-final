import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173", // For local development
      "https://mood-melody.netlify.app", // For deployed frontend
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies and credentials
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.use("/api/users", userRoutes);
app.use("/api/moods", moodRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
