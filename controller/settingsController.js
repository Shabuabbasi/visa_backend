import Settings from "../models/settingsModel.js";

/**
 * Return backend base URL:
 * - Prefer explicit BACKEND_URL from env (recommended for prod)
 * - Fallback to req.protocol + host (useful for local dev)
 */
export const getBaseUrl = (req) => {
  if (process.env.NODE_ENV === "development") {
    return `${req.protocol}://${req.get("host")}`;
  }
  return process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
};

// ✅ If logo is already a full URL, just return it
const buildLogoUrl = (baseUrl, logoField) => {
  if (!logoField) return ""; // no logo set
  if (typeof logoField === "string" && logoField.startsWith("http")) {
    return logoField; // already full URL (Cloudinary, external, etc.)
  }
  // fallback for old local files
  return `${baseUrl}/uploads/${logoField}`;
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
        companyName: settings.companyName,
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
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    // Update simple fields
    settings.companyName = req.body.companyName || settings.companyName;

    // ✅ Store full Cloudinary URL instead of filename
    if (req.body.logoUrl) {
      settings.logo = req.body.logoUrl; 
    }

    // Footer
    settings.footer.contactEmail =
      req.body.footer?.email || settings.footer.contactEmail;
    settings.footer.contactPhone =
      req.body.footer?.phone || settings.footer.contactPhone;
    settings.footer.address =
      req.body.footer?.address || settings.footer.address;

    await settings.save();

    const baseUrl = getBaseUrl(req);
    const logoUrl = buildLogoUrl(baseUrl, settings.logo);

    res.json({
      success: true,
      settings: {
        companyName: settings.companyName,
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
