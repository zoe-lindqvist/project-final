import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

import userRoutes from "./routes/userRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Mood Melody API!",
    endpoints: listEndpoints(app),
  });
});

app.use("/api/users", userRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/badges", badgeRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
