import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";

import businessRoutes from "./Routes/businessRoutes.js";
import contactRoutes from "./Routes/contactRoutes.js";
import leadRoutes from "./Routes/leadRoutes.js";
import settingsRoutes from "./Routes/settingsRoutes.js";
import { seedSettings } from "./seed/seedSettings.js";

import userRoutes from "./Routes/userRoutes.js";

const app = express();

// ===== Middleware =====
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form-data
app.use(cookieParser());

// Debug middleware - log all requests + body
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("   Body:", req.body);
  }
  next();
});

// // Serve static uploads (legacy/local use)
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ===== CORS setup =====
// const allowedOrigins = [
//   "http://localhost:5173", // local frontend
//   "https://clever-faun-209c47.netlify.app", // netlify frontend
//   "https://frontend-booking-dcdj.vercel.app", // vercel frontend
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true); // allow Postman/curl
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         console.warn("❌ Blocked by CORS:", origin);
//         return callback(new Error("Not allowed by CORS"), false);
//       }
//     },
//     credentials: true,
//   })
// );



app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);


// ===== Routes =====
app.use("/api/business", businessRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/settings", settingsRoutes);
// app.use("/api/upload", uploadRoutes);
app.use("/api/auth", userRoutes);



app.get("/ping", (req, res) => {
  res.send("pong");
});


// ===== MongoDB Connection =====
// ===== MongoDB Connection =====
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // 👇 Run seeder once DB is connected
    await seedSettings();
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};
connectDB();


// ===== Health check route =====
app.get("/", (req, res) => {
  res.send("🚀 Express server is running...");
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("⚠️ Server Error:", err.message || err);
  if (err.stack) {
    console.error(err.stack);
  }
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
