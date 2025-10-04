// pages/Settings/Settings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff, Store, Clock, Truck, Users, Bell } from "lucide-react";

const Settings = ({ url }) => {
  const [activeTab, setActiveTab] = useState("password");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Restaurant Information
    restaurantName: "",
    contactEmail: "",
    phoneNumber: "",
    address: "",

    // Business Hours
    openingTime: "09:00",
    closingTime: "22:00",
    isOpen: true,

    // Delivery Settings
    deliveryFee: 0,
    minimumOrder: 0,
    deliveryRadius: 5,
    estimatedDeliveryTime: "30-45",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    newOrderAlerts: true,
    currency: "NGN",
    timezone: "UTC",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Fetch current settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log("Fetching settings from backend...");

      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${url}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        console.log("Settings fetched successfully:", response.data.settings);
        setSettings(response.data.settings);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      console.error("Error response:", err.response?.data);
      toast.error("Failed to load settings");
    }
  };

  const handleSettingsChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSettings = async (section) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      console.log("Saving settings section:", section);

      // Define what data to send for each section
      const sectionData = {
        restaurant: {
          restaurantName: settings.restaurantName,
          contactEmail: settings.contactEmail,
          phoneNumber: settings.phoneNumber,
          address: settings.address,
        },
        hours: {
          openingTime: settings.openingTime,
          closingTime: settings.closingTime,
          isOpen: settings.isOpen,
        },
        delivery: {
          deliveryFee: settings.deliveryFee,
          minimumOrder: settings.minimumOrder,
          deliveryRadius: settings.deliveryRadius,
          estimatedDeliveryTime: settings.estimatedDeliveryTime,
        },
        notifications: {
          emailNotifications: settings.emailNotifications,
          smsNotifications: settings.smsNotifications,
          lowStockAlerts: settings.lowStockAlerts,
          newOrderAlerts: settings.newOrderAlerts,
        },
      };

      const dataToSend = sectionData[section] || settings;

      console.log("Sending data:", dataToSend);

      const response = await axios.patch(
        `${url}/api/admin/settings/section`,
        {
          section,
          data: dataToSend, // Send only the relevant section data
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Settings saved successfully:", response.data);

      if (response.data.success) {
        toast.success("Settings updated successfully!");
      }
    } catch (err) {
      console.error("Settings update error:", err);
      console.error("Error details:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `${url}/api/admin/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswords({ current: false, new: false, confirm: false });
      }
    } catch (err) {
      console.error("Password change error:", err);
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const tabs = [
    { id: "restaurant", label: "Restaurant", icon: Store },
    { id: "hours", label: "Hours", icon: Clock },
    { id: "delivery", label: "Delivery", icon: Truck },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "password", label: "Password", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Manage your restaurant settings and preferences
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
          {/* Tabs - Improved responsiveness */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`flex items-center px-4 sm:px-6 py-3 border-b-2 font-medium text-sm whitespace-nowrap flex-1 sm:flex-none min-w-0 ${
                      activeTab === tab.id
                        ? "border-green-500 text-green-600 bg-green-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    } transition-colors duration-200`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <IconComponent className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Restaurant Information Tab */}
            {activeTab === "restaurant" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Restaurant Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    Update your restaurant details
                  </p>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      value={settings.restaurantName}
                      onChange={(e) =>
                        handleSettingsChange("restaurantName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) =>
                        handleSettingsChange("contactEmail", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={settings.phoneNumber}
                      onChange={(e) =>
                        handleSettingsChange("phoneNumber", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={settings.address}
                      onChange={(e) =>
                        handleSettingsChange("address", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <button
                  onClick={() => saveSettings("restaurant")}
                  disabled={loading}
                  className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Saving..." : "Save Restaurant Info"}
                </button>
              </div>
            )}

            {/* Business Hours Tab */}
            {activeTab === "hours" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Business Hours
                  </h3>
                  <p className="text-sm text-gray-600">
                    Set your restaurant operating hours
                  </p>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      value={settings.openingTime}
                      onChange={(e) =>
                        handleSettingsChange("openingTime", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      value={settings.closingTime}
                      onChange={(e) =>
                        handleSettingsChange("closingTime", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-700">
                        Restaurant is currently open
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          handleSettingsChange("isOpen", !settings.isOpen)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.isOpen ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.isOpen ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => saveSettings("hours")}
                  disabled={loading}
                  className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Saving..." : "Save Business Hours"}
                </button>
              </div>
            )}

            {/* Delivery Settings Tab */}
            {activeTab === "delivery" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Delivery Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configure delivery options and fees
                  </p>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Fee (₦)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.deliveryFee}
                      onChange={(e) =>
                        handleSettingsChange(
                          "deliveryFee",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Order (₦)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.minimumOrder}
                      onChange={(e) =>
                        handleSettingsChange(
                          "minimumOrder",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Radius (km)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settings.deliveryRadius}
                      onChange={(e) =>
                        handleSettingsChange(
                          "deliveryRadius",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Delivery Time
                    </label>
                    <input
                      type="text"
                      value={settings.estimatedDeliveryTime}
                      onChange={(e) =>
                        handleSettingsChange("estimatedDeliveryTime", e.target.value)
                      }
                      placeholder="e.g., 30-45"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <button
                  onClick={() => saveSettings("delivery")}
                  disabled={loading}
                  className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Saving..." : "Save Delivery Settings"}
                </button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Notification Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage your notification preferences
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "emailNotifications",
                      label: "Email Notifications",
                      value: settings.emailNotifications,
                    },
                    {
                      key: "smsNotifications",
                      label: "SMS Notifications",
                      value: settings.smsNotifications,
                    },
                    {
                      key: "lowStockAlerts",
                      label: "Low Stock Alerts",
                      value: settings.lowStockAlerts,
                    },
                    {
                      key: "newOrderAlerts",
                      label: "New Order Alerts",
                      value: settings.newOrderAlerts,
                    },
                  ].map(({ key, label, value }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSettingsChange(key, !value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => saveSettings("notifications")}
                  disabled={loading}
                  className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Saving..." : "Save Notification Settings"}
                </button>
              </div>
            )}

            {/* Password Change Tab */}
            {activeTab === "password" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Change Password
                  </h3>
                  <p className="text-sm text-gray-600">
                    Update your password regularly to keep your account secure
                  </p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10 text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.current ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        required
                        minLength="8"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10 text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.new ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10 text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? "Changing Password..." : "Change Password"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;