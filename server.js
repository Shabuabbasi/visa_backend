import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";

import businessRoutes from "./Routes/businessRoutes.js";
import contactRoutes from "./Routes/contactRoutes.js";
import leadRoutes from "./Routes/leadRoutes.js";
import settingsRoutes from "./Routes/settingsRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";
import userRoutes from "./Routes/userRoutes.js";

dotenv.config();
const app = express();

// =========================
// Middleware
// =========================
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Allowed frontend domains
const allowedOrigins = [
  "http://localhost:5173",                       // local dev (Vite/React)
  "https://clever-faun-209c47.netlify.app",      // Netlify deployed frontend
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests without origin (Postman / server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error("❌ Blocked by CORS:", origin);
        return callback(new Error("❌ Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

// ✅ Extra fallback (Railway sometimes strips headers)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// =========================
// Routes
// =========================
app.use("/api/business", businessRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", userRoutes);

// =========================
// MongoDB Connection
// =========================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};
connectDB();

// =========================
// Sample route
// =========================
app.get("/", (req, res) => {
  res.send("🚀 Express server is running...");
});

// =========================
// Global error handler
// =========================
app.use((err, req, res, next) => {
  console.error("⚠️ Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// =========================
// Start server
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
