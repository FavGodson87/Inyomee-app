import mongoose from "mongoose";

const restaurantSettingsSchema = new mongoose.Schema({
  // Restaurant Information
  restaurantName: { 
    type: String, 
    default: "My Restaurant" 
  },
  contactEmail: { 
    type: String, 
    default: "contact@myrestaurant.com" 
  },
  phoneNumber: { 
    type: String, 
    default: "+1234567890" 
  },
  address: { 
    type: String, 
    default: "" 
  },
  
  // Business Hours
  openingTime: { 
    type: String, 
    default: "09:00" 
  },
  closingTime: { 
    type: String, 
    default: "22:00" 
  },
  isOpen: { 
    type: Boolean, 
    default: true 
  },
  
  // Delivery Settings
  deliveryFee: { 
    type: Number, 
    default: 0 
  },
  minimumOrder: { 
    type: Number, 
    default: 0 
  },
  deliveryRadius: { 
    type: Number, 
    default: 5 
  },
  estimatedDeliveryTime: { 
    type: String, 
    default: "30-45" 
  },
  
  // Notification Settings
  emailNotifications: { 
    type: Boolean, 
    default: true 
  },
  smsNotifications: { 
    type: Boolean, 
    default: false 
  },
  lowStockAlerts: { 
    type: Boolean, 
    default: true 
  },
  newOrderAlerts: { 
    type: Boolean, 
    default: true 
  },
  
  // System Settings
  currency: {
    type: String,
    default: "NGN"
  },
  timezone: {
    type: String,
    default: "UTC"
  }
}, { 
  timestamps: true 
});

// Create a singleton document
restaurantSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const RestaurantSettings = mongoose.models.RestaurantSettings || mongoose.model('RestaurantSettings', restaurantSettingsSchema);

export default RestaurantSettings;