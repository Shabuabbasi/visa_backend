import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "booking_logos", // all files go into this folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ quality: "auto", fetch_format: "auto" }], // optimize images
  },
});

const upload = multer({ storage });

// ✅ POST /api/upload/logo
router.post("/logo", upload.single("logo"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  res.json({
    success: true,
    fileUrl: req.file.path, // ✅ Cloudinary secure URL
  });
});

export default router;
