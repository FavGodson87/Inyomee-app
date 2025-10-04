import Admin from "../models/adminModal.js";
import jwt from "jsonwebtoken";
import validator from "validator";

// ADMIN LOGIN - WITH DEBUG LOGGING
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log("ADMIN LOGIN ATTEMPT:", {
    email,
    password: password ? "***" : "missing",
  });

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email, isActive: true });
    console.log("Admin found:", !!admin);

    if (!admin) {
      console.log(" Admin not found or inactive");
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    console.log("Admin details:", {
      id: admin._id,
      email: admin.email,
      passwordHash: admin.password.substring(0, 20) + "...",
    });

    // Check password
    console.log("Checking password...");
    const isMatch = await admin.comparePassword(password);
    console.log("🔍 Password match:", isMatch);

    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    console.log("Admin login successful");

    // Create admin token (different from user token)
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" } // Shorter expiry for admin tokens
    );

    res.json({
      success: true,
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during admin login",
    });
  }
};

// CREATE ADMIN (for initial setup - protect this route!)
const createAdmin = async (req, res) => {
  const { username, name, password, email, role } = req.body;

  try {
    // Check if admin already exists
    const exists = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Create new admin
    const newAdmin = new Admin({
      username,
      name,
      email,
      password, // Will be hashed by pre-save middleware
      role: role || "admin",
    });

    const admin = await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating admin",
    });
  }
};

// VALIDATE ADMIN TOKEN
const validateAdminToken = async (req, res) => {
  try {
    res.json({
      success: true,
      admin: {
        _id: req.admin._id,
        email: req.admin.email,
        role: req.admin.role,
        permissions: req.admin.permissions,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid admin token",
    });
  }
};

// GET ALL ADMINS (for super admin only)
const getAdmins = async (req, res) => {
  try {
    // Check if current admin has permission
    if (req.admin.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const admins = await Admin.find({}).select("-password");
    res.json({
      success: true,
      admins,
    });
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admins",
    });
  }
};

// CHANGE ADMIN PASSWORD
const changeAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  console.log("🔍 ADMIN PASSWORD CHANGE ATTEMPT:", {
    adminId: req.admin._id,
    email: req.admin.email,
  });

  try {
    // Find the admin
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Verify current password
    console.log("🔍 Verifying current password...");
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      console.log("❌ Current password is incorrect");
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }

    // Update password
    console.log("🔍 Updating password...");
    admin.password = newPassword; // This will be hashed by the pre-save middleware
    await admin.save();

    console.log("✅ Admin password changed successfully");

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("❌ Change admin password error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
    });
  }
};

export {
  adminLogin,
  createAdmin,
  validateAdminToken,
  getAdmins,
  changeAdminPassword,
};
