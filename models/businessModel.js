import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    businessName: { type: String, required: true },
    businessType: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["New", "In Progress", "Closed"], default: "New" },
  
  },
  { timestamps: true }
);

const Business = mongoose.model("Business", businessSchema);

export default Business;