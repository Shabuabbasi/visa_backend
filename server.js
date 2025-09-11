// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

import businessRoutes from "./Routes/businessRoutes.js";
import contactRoutes from "./Routes/contactRoutes.js";
import leadRoutes from "./Routes/leadRoutes.js";
import settingsRoutes from "./Routes/settingsRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import { seedSettings } from "./seed/seedSettings.js";

const app = express();

// ===== Middleware =====
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form-data

// ===== CORS Setup =====
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL, // Only allow your frontend
    credentials: true,    // Allow cookies if needed
  })
);

// ===== Debug Logging Middleware =====
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("   Body:", req.body);
  }
  next();
});

// ===== Routes =====
app.use("/api/business", businessRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", userRoutes);

// ===== Ping / Health Check =====
app.get("/ping", (req, res) => {
  res.json({ success: true, message: "pong" });
});

// ===== Favicon =====
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "favicon.ico"));
});

// ===== MongoDB Connection =====
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Seed default settings safely
    try {
      await seedSettings();
    } catch (err) {
      console.error("❌ Seeder error:", err.message);
    }
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Crash if DB unreachable
  }
};
connectDB();

// ===== Root Route =====
app.get("/", (req, res) => {
  res.send("🚀 Express server is running...");
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("⚠️ Server Error:", err.message || err);
  if (err.stack) console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
