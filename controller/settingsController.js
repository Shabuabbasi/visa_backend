import Settings from "../models/settingsModel.js";

// Helper to get base URL depending on environment
const getBaseUrl = (req) => {
  if (process.env.NODE_ENV === "production") {
    return "https://bookingbackend-production-0a58.up.railway.app";
  }
  return `${req.protocol}://${req.get("host")}`;
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

    res.json({
      success: true,
      settings: {
        companyName: settings.companyName,
        logoUrl: settings.logo
          ? `${baseUrl}/uploads/${settings.logo}`
          : `${baseUrl}/uploads/logo.png`,
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
    if (!settings) {
      settings = new Settings();
    }

    // Update fields
    settings.companyName = req.body.companyName || settings.companyName;

    // Handle logo upload: store filename only
    if (req.body.logoUrl) {
      const filename = req.body.logoUrl.split("/").pop();
      settings.logo = filename;
    }

    settings.footer.contactEmail =
      req.body.footer?.email || settings.footer.contactEmail;
    settings.footer.contactPhone =
      req.body.footer?.phone || settings.footer.contactPhone;
    settings.footer.address =
      req.body.footer?.address || settings.footer.address;

    await settings.save();

    const baseUrl = getBaseUrl(req);

    res.json({
      success: true,
      settings: {
        companyName: settings.companyName,
        logoUrl: settings.logo
          ? `${baseUrl}/uploads/${settings.logo}`
          : `${baseUrl}/uploads/logo.png`,
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
