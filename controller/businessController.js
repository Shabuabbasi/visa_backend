import Business from "../models/businessModel.js";

// Create business entry
export const createBusiness = async (req, res) => {
  try {
    const business = new Business(req.body);
    await business.save();
    res.status(201).json({ message: "Business saved successfully", business });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all businesses
export const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



