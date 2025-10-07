import User from "../models/userModal.js";
import UserSettings from "../models/userSettingsModal.js";
import bcrypt from "bcryptjs";

// Get user profile and settings
export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const settings = await UserSettings.findOne({ userId: req.user._id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        username: user.username,
        phone: settings?.phone || "",
        address: settings?.address || {},
      },
      settings: {
        notifications: settings?.notifications || {},
        payment: settings?.payment || {},
        theme: settings?.theme || "auto",
        currentTier: settings?.currentTier || "bronze",
        rewardProgress: user.rewardProgress,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update profile info (name, phone, address)
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    // Update user name
    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    // Update settings (phone, address)
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          phone: phone || "",
          address: address || {},
        },
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        name: name || req.user.name,
        phone: settings.phone,
        address: settings.address,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters",
        });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Use findByIdAndUpdate instead of save() to avoid validation issues
    await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      { runValidators: true }
    );

    console.log(`Password updated successfully for user: ${user.email}`);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error changing password" });
  }
};

// Update notification preferences
export const updateNotifications = async (req, res) => {
  try {
    const { email, sms, push, rewardsReminders } = req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          "notifications.email": email,
          "notifications.sms": sms,
          "notifications.push": push,
          "notifications.rewardsReminders": rewardsReminders,
        },
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Notification preferences updated",
      notifications: settings.notifications,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating notifications" });
  }
};

// Update payment preferences
export const updatePaymentPreferences = async (req, res) => {
  try {
    const { defaultMethod, defaultCardId } = req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          "payment.defaultMethod": defaultMethod,
          "payment.defaultCardId": defaultCardId,
        },
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Payment preferences updated",
      payment: settings.payment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating payment preferences" });
  }
};

// Update theme
export const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    if (!["light", "dark", "auto"].includes(theme)) {
      return res.status(400).json({ success: false, message: "Invalid theme" });
    }

    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { theme } },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Theme updated",
      theme: settings.theme,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating theme" });
  }
};

// Get rewards info
export const getRewardsInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("rewardProgress");
    const settings = await UserSettings.findOne({
      userId: req.user._id,
    }).select("currentTier");

    res.json({
      success: true,
      rewardProgress: user.rewardProgress,
      currentTier: settings?.currentTier || "bronze",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching rewards info" });
  }
};
