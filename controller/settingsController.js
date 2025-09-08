import Settings from "../models/settingsModel.js";

// GET settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    // Build base URL dynamically
    const baseUrl = `${req.protocol}://${req.get("host")}`;

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

    // Map frontend fields → backend schema
    settings.companyName = req.body.companyName || settings.companyName;

    // Store only filename in DB, not full URL
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

    const baseUrl = `${req.protocol}://${req.get("host")}`;

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
