import express from "express";
import {  addLeads, getLeads } from "../controller/leadController.js";


const router = express.Router();


router.post("/", addLeads); 
router.get("/", getLeads)
  // GET all data

export default router;