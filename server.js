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

// ===== CORS =====
const allowedOrigins = process.env.FRONTEND_URL?.split(",") || [];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server requests
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(
          new Error("CORS policy does not allow this origin"),
          false
        );
      }
      return callback(null, true);
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

// ===== Ping / Health Check =====
app.get("/ping", (req, res) => res.json({ success: true, message: "pong" }));

// ===== Root (Railway health check) =====
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is live 🚀" });
});

// ===== MongoDB Connection =====
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    await seedSettings().catch((err) =>
      console.error("❌ Seeder error:", err.message)
    );
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
};

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB();
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("⚠️ Server Error:", err.message || err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});
