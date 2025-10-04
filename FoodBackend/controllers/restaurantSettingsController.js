import RestaurantSettings from "../models/restaurantSettingsModel.js";

// Get all restaurant settings
export const getRestaurantSettings = async (req, res) => {
  try {

    console.log("Fetching restaurant settings...")

    const settings = await RestaurantSettings.getSettings();

    console.log("✅ Settings fetched successfully:", {
      settingsId: settings._id,
      restaurantName: settings.restaurantName
    });
    
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error("Get restaurant settings error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching restaurant settings"
    });
  }
};

// Update restaurant settings
export const updateRestaurantSettings = async (req, res) => {
  try {
    const updates = req.body;

    console.log("Received settings update request:", {
      adminId: req.admin._id,
      adminEmail: req.admin.email,
      updates: updates
    });
    
    let settings = await RestaurantSettings.findOne();
    
    if (!settings) {
      // Create initial settings if they don't exist
        console.log(" No existing settings found, creating new...")
      settings = await RestaurantSettings.create(updates);
    } else {
      // Update existing settings
      console.log(" Updating existing settings...")
      settings = await RestaurantSettings.findOneAndUpdate(
        {},
        { $set: updates },
        { new: true, runValidators: true }
      );
    }

    console.log("✅ Settings updated successfully:", {
      settingsId: settings._id,
      updatedFields: Object.keys(updates)
    });

    res.json({
      success: true,
      message: "Restaurant settings updated successfully",
      settings
    });
  } catch (error) {
    console.error("Update restaurant settings error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating restaurant settings"
    });
  }
};

// Update specific section of settings
export const updateSettingsSection = async (req, res) => {
  try {
    const { section, data } = req.body;

     console.log("🔄 Received section update request:", {
      adminId: req.admin._id,
      section,
      data
    });
    
    if (!section || !data) {
        console.log("❌ Missing section or data");
      return res.status(400).json({
        success: false,
        message: "Section and data are required"
      });
    }

    const updateQuery = {};
    for (const [key, value] of Object.entries(data)) {
      updateQuery[`${key}`] = value;
    }

    let settings = await RestaurantSettings.findOne();
    
    if (!settings) {
        console.log("📝 No existing settings found, creating new with section data...")
      settings = await RestaurantSettings.create(updateQuery);
    } else {
        console.log(`📝 Updating settings section: ${section}`)
      settings = await RestaurantSettings.findOneAndUpdate(
        {},
        { $set: updateQuery },
        { new: true, runValidators: true }
      );
    }

    console.log("✅ Section settings updated successfully:", {
      settingsId: settings._id,
      section,
      updatedFields: Object.keys(data)
    });

    res.json({
      success: true,
      message: `${section} settings updated successfully`,
      settings
    });
  } catch (error) {
    console.error("Update settings section error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating settings section"
    });
  }
};