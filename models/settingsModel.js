import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  companyName: { type: String, default: "Bookings" },
  // Store only file name instead of full URL
  logo: { type: String, default: "logo.png" }, 

  footer: {
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
});

export default mongoose.model("Settings", settingsSchema);
