// scripts/createInitialAdmin.js
import mongoose from "mongoose";
import Admin from "../models/adminModal.js";

// Use the SAME connection method as your main app
const createInitialAdmin = async () => {
  try {
    console.log("🔗 Connecting to MongoDB using your main app's configuration...");
    
    // Use the exact same connection as your main app
    // This should work since your main app already connects successfully
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");
    
    const adminExists = await Admin.findOne({ email: "admin@inyomee.com" });
    
    if (!adminExists) {
      const admin = new Admin({
        username: "superadmin",
        name: "Super Admin",
        email: "admin@inyomee.com",
        password: "admin123456",
        role: "super_admin",
        permissions: {
          manageUsers: true,
          manageProducts: true,
          manageOrders: true,
          manageSettings: true
        }
      });
      
      await admin.save();
      console.log("🎉 SUCCESS: Initial admin created!");
      console.log("📧 Email: admin@inyomee.com");
      console.log("🔑 Password: admin123456");
      console.log("💡 Change these credentials after first login!");
    } else {
      console.log("ℹ️ Admin already exists");
    }
    
    await mongoose.disconnect();
    console.log("✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n💡 Since your main app works, try this:");
    console.log("1. Copy the MONGODB_URI from your main .env file");
    console.log("2. Make sure your IP is whitelisted in MongoDB Atlas");
  }
};

createInitialAdmin();