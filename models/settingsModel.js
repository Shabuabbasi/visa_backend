import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  companyName: { type: String, default: "Bookings" },
  logo: { type: String, default: "" }, // store image URL only
  footer: {
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
});

export default mongoose.model("Settings", settingsSchema);

