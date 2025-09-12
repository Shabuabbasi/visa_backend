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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== CORS Setup =====
const allowedOrigins = [
  "http://localhost:5173",
  "https://clever-faun-209c47.netlify.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server-to-server requests
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error("CORS policy does not allow this origin"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

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

// ===== Root Route =====
app.get("/", (req, res) => {
  res.send("🚀 Express server is running...");
});

// ===== Favicon =====
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "favicon.ico"));
});

// ===== MongoDB Connection (Async, Non-blocking) =====
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    // Seed settings asynchronously
    try {
      await seedSettings();
    } catch (err) {
      console.error("❌ Seeder error:", err.message);
    }
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Do NOT exit process immediately; server will still respond
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
