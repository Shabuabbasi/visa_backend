import Settings from "../models/settingsModel.js";

export const seedSettings = async () => {
  try {
    const existing = await Settings.findOne();
    if (!existing) {
      await Settings.create({
        companyName: "Bookings",
        logo: "",
        footer: {
          contactEmail: "info@bookings.com",
          contactPhone: "+123456789",
          address: "123 Default Street, City",
        },
      });
      console.log("✅ Default settings created.");
    } else {
      console.log("ℹ️ Settings already exist, skipping seed.");
    }
  } catch (err) {
    console.error("❌ Error seeding settings:", err.message);
  }
};
