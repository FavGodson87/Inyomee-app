import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },
  // Profile Info
  phone: { type: String, default: "" },
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" }
  },
  // Notifications
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    rewardsReminders: { type: Boolean, default: true }
  },
  // Payment Preferences
  payment: {
    defaultMethod: { 
      type: String, 
      enum: ['card', 'cod'], 
      default: 'cod' 
    },
    defaultCardId: { type: String, default: "" }
  },
  // Theme
  theme: { 
    type: String, 
    enum: ['light', 'dark', 'auto'], 
    default: 'auto' 
  },
  // Rewards
  currentTier: { 
    type: String, 
    enum: ['bronze', 'silver', 'gold', 'platinum'], 
    default: 'bronze' 
  }
}, { timestamps: true });

const UserSettings = mongoose.models.UserSettings || mongoose.model('UserSettings', userSettingsSchema);

export default UserSettings;