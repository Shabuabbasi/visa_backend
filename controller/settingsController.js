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
    // ✅ Safe fallback: avoid crash if body is missing
    const body = req.body || {};

    const { companyName, logoUrl, footer } = body;

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (companyName !== undefined) settings.companyName = companyName;
    if (logoUrl !== undefined) settings.logo = logoUrl;

    if (footer) {
      if (footer.email !== undefined) settings.footer.contactEmail = footer.email;
      if (footer.phone !== undefined) settings.footer.contactPhone = footer.phone;
      if (footer.address !== undefined) settings.footer.address = footer.address;
    }

    await settings.save();
    res.json({ success: true, settings: formatSettings(settings) });
  } catch (err) {
    console.error("❌ Error updating settings:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
