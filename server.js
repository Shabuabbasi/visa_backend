// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

import businessRoutes from "./Routes/businessRoutes.js";
import contactRoutes from "./Routes/contactRoutes.js";
import leadRoutes from "./Routes/leadRoutes.js";
import settingsRoutes from "./Routes/settingsRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import { seedSettings } from "./seed/seedSettings.js";

dotenv.config();
const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== CORS Setup =====
const allowedOrigins = process.env.FRONTEND_URL?.split(",") || [];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server requests
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
  })
);

// ===== Debug Logging =====
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  next();
});

// ===== Routes =====
app.use("/api/business", businessRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth", userRoutes);

// ===== Health Check =====
app.get("/ping", (req, res) => {
  res.json({ success: true, message: "pong" });
});

// ===== MongoDB =====
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");

    // Seed default settings
    await seedSettings().catch((err) =>
      console.error("❌ Seeder error:", err.message)
    );
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
  }
};

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB(); // connect DB only after server is up
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("⚠️ Server Error:", err.message || err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});
