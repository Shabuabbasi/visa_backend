import Settings from "../models/settingsModel.js";

// Helper
const formatSettings = (settings) => ({
  companyName: settings.companyName || "",
  logoUrl: settings.logo || "",
  footer: {
    email: settings.footer?.contactEmail || "",
    phone: settings.footer?.contactPhone || "",
    address: settings.footer?.address || "",
  },
});

// ✅ GET /api/settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json({ success: true, settings: formatSettings(settings) });
  } catch (err) {
    console.error("❌ Error fetching settings:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ PUT /api/settings
export const updateSettings = async (req, res) => {
  try {
    const { companyName, logoUrl, footer } = req.body;

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (companyName) settings.companyName = companyName;
    if (logoUrl) settings.logo = logoUrl;

    if (footer) {
      settings.footer.contactEmail = footer.email || settings.footer.contactEmail;
      settings.footer.contactPhone = footer.phone || settings.footer.contactPhone;
      settings.footer.address = footer.address || settings.footer.address;
    }

    await settings.save();
    res.json({ success: true, settings: formatSettings(settings) });
  } catch (err) {
    console.error("❌ Error updating settings:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
