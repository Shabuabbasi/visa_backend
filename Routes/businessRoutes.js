import express from "express";
import { createBusiness, getBusinesses } from "../controller/businessController.js";

const router = express.Router();

router.post("/", createBusiness); // POST form data
router.get("/", getBusinesses);   // GET all data

export default router;
