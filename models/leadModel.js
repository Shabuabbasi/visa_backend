// models/Lead.js
import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
  serviceType: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["New", "In Progress", "Closed"], default: "New" },
  }
);


export default mongoose.model("Lead", leadSchema);
