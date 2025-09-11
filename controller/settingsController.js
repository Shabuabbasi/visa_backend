import Settings from "../models/settingsModel.js";

// Get backend base URL
export const getBaseUrl = (req) => {
  if (process.env.NODE_ENV === "development") {
    return `${req.protocol}://${req.get("host")}`;
  }
  return process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
};

// Build logo URL for frontend
const buildLogoUrl = (baseUrl, logoField) => {
  if (!logoField) return "";
  if (typeof logoField === "string" && logoField.startsWith("http")) {
    return logoField; // Cloudinary URL
  }
  return `${baseUrl}/uploads/${logoField}`; // local
};

// GET settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    const baseUrl = getBaseUrl(req);
    const logoUrl = buildLogoUrl(baseUrl, settings.logo);

    res.json({
      success: true,
      settings: {
        companyName: settings.companyName || "",
        logoUrl,
        footer: {
          email: settings.footer?.contactEmail || "",
          phone: settings.footer?.contactPhone || "",
          address: settings.footer?.address || "",
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE settings
export const updateSettings = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ success: false, message: "No data provided" });
    console.log("➡️ Incoming settings update:", req.body);

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ companyName: "", logo: "", footer: { contactEmail: "", contactPhone: "", address: "" } });
    }

    // Update fields safely
    settings.companyName = req.body.companyName || settings.companyName;

    if (req.body.logoUrl) {
      settings.logo = req.body.logoUrl.startsWith(`${req.protocol}://`)
        ? req.body.logoUrl // full URL (Cloudinary or external)
        : req.body.logoUrl.replace(/^\/uploads\//, ""); // local file
    }

    settings.footer = {
      contactEmail: req.body.footer?.email || settings.footer?.contactEmail || "",
      contactPhone: req.body.footer?.phone || settings.footer?.contactPhone || "",
      address: req.body.footer?.address || settings.footer?.address || "",
    };

    await settings.save();

    const baseUrl = getBaseUrl(req);
    const logoUrl = buildLogoUrl(baseUrl, settings.logo);

    res.json({
      success: true,
      settings: {
        companyName: settings.companyName,
        logoUrl,
        footer: settings.footer,
      },
    });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
