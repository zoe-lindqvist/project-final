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

app.use(cors());
app.use(express.json());

// Request logging middleware (add it here)
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`, req.body);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.use("/api/users", userRoutes);
app.use("/api/moods", moodRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
