import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Settings from "../models/settingsModel.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadsFolder = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsFolder)) fs.mkdirSync(uploadsFolder);

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Local storage
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsFolder),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

// Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "booking_logos",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  }),
});

// Choose storage: Cloudinary if keys exist, else local
const upload = multer({
  storage: process.env.CLOUDINARY_API_KEY ? cloudinaryStorage : localStorage,
});

// POST /logo
router.post("/logo", upload.single("logo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    let fileUrl;

    // Cloudinary URL
    if (req.file.path?.startsWith("http")) {
      fileUrl = req.file.path;
    } else if (req.file.location) {
      fileUrl = req.file.location;
    } else {
      // Local URL
      fileUrl = `/uploads/${req.file.filename}`;
    }

    // ✅ Optional: auto-update settings document with new logo
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ companyName: "", logo: "", footer: { contactEmail: "", contactPhone: "", address: "" } });
    }
    settings.logo = fileUrl;
    await settings.save();

    res.json({ success: true, fileUrl });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
});

export default router;
