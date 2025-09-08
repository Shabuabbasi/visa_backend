import express from "express";
import { saveContact, getContacts } from "../controller/contactController.js";

const router = express.Router();

router.post("/", saveContact);   // Contact form save
router.get("/", getContacts);    // Admin panel ke liye data fetch

export default router;
