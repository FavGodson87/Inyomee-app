import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  CiUser,
  CiLock,
  CiBellOn,
  CiCreditCard1,
  CiStar,
} from "react-icons/ci";
import CustomDropdown from "../../components/CustomDropdown";

const SettingsPage = () => {
  const { token, fetchUserSettings } = React.useContext(StoreContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in and fetch settings
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const loadSettings = async () => {
      try {
        const settingsData = await fetchUserSettings();
        setSettings(settingsData);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [token, navigate, fetchUserSettings]);

  const tabs = [
    { id: "profile", label: "Profile", icon: <CiUser className="mb-1" /> },
    { id: "password", label: "Password", icon: <CiLock className="mb-1" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <CiBellOn className="mb-0.5" />,
    },
    {
      id: "payment",
      label: "Payment",
      icon: <CiCreditCard1 className="mb-0.5" />,
    },
    { id: "rewards", label: "Rewards", icon: <CiStar className="mb-1" /> },
  ];

  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20 lg:pb-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page min-h-screen bg-gray-50 pt-24 pb-20 lg:pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="settings-header mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account preferences and security
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "profile" && <ProfileTab settings={settings} />}
            {activeTab === "password" && <PasswordTab />}
            {activeTab === "notifications" && (
              <NotificationsTab settings={settings} />
            )}
            {activeTab === "payment" && <PaymentTab settings={settings} />}
            {activeTab === "rewards" && <RewardsTab settings={settings} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({ settings }) => {
  const { userData, updateProfile } = React.useContext(StoreContext);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    phone: settings?.profile?.phone || "",
    address: settings?.profile?.address || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateProfile(formData);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Personal Information
        </h3>
        <p className="text-sm text-gray-600">Update your personal details</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Address</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street
            </label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>

      {message && (
        <p
          className={`text-sm ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

// Password Tab Component
const PasswordTab = () => {
  const { changePassword } = React.useContext(StoreContext);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setMessage("Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
        <p className="text-sm text-gray-600">
          Update your password regularly to keep your account secure
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
              minLength="8"
            />
            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Updating..." : "Change Password"}
      </button>

      {message && (
        <p
          className={`text-sm ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

// Notifications Tab Component
const NotificationsTab = ({ settings }) => {
  const { updateNotifications } = React.useContext(StoreContext);
  const [formData, setFormData] = useState({
    email: settings?.notifications?.email ?? true,
    sms: settings?.notifications?.sms ?? false,
    push: settings?.notifications?.push ?? true,
    rewardsReminders: settings?.notifications?.rewardsReminders ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateNotifications(formData);
      setMessage("Notification preferences updated!");
    } catch (error) {
      setMessage("Error updating notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Notification Preferences
        </h3>
        <p className="text-sm text-gray-600">
          Choose how you want to receive notifications
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, [key]: !value }))
              }
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
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Updating..." : "Save Preferences"}
      </button>

      {message && (
        <p
          className={`text-sm ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

// Payment Tab Component
const PaymentTab = ({ settings }) => {
  const { updatePaymentPreferences } = React.useContext(StoreContext);
  const [formData, setFormData] = useState({
    defaultMethod: settings?.payment?.defaultMethod || "cod",
    // defaultCardId: settings?.payment?.defaultCardId || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updatePaymentPreferences({
    defaultMethod: formData.defaultMethod, 
  });
      setMessage("Payment preferences updated!");
    } catch (error) {
      setMessage("Error updating payment preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Payment Preferences
        </h3>
        <p className="text-sm text-gray-600">
          Manage your default payment methods
        </p>
      </div>

      {/* Payment Method */}
      <div className="mt-5 w-full">
        <CustomDropdown
          value={formData.defaultMethod}
          onChange={(value) =>
            setFormData({ ...formData, defaultMethod: value })
          }
          options={[
            { value: "cod", label: "Cash on Delivery" },
            { value: "online", label: "Pay Online" },
          ]}
          placeholder="Select Payment Method"
          className="w-full"
          buttonClassName="px-4 py-3 rounded-xl"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Updating..." : "Save Preferences"}
      </button>

      {message && (
        <p
          className={`text-sm ${
            message.includes("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};


// Rewards Tab Component
const RewardsTab = ({ settings }) => {
  const { rewardProgress, getRewardTierInfo } = React.useContext(StoreContext);
  const tierInfo = getRewardTierInfo();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Rewards & Loyalty</h3>
        <p className="text-sm text-gray-600">
          Track your rewards progress and benefits
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CiStar className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-xl font-semibold text-gray-900">
            {tierInfo.level} Tier
          </h4>
          <p className="text-green-600 font-medium">
            {tierInfo.discount > 0
              ? `${tierInfo.discount}% Discount Applied`
              : "Earn discounts as you progress!"}
          </p>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to {tierInfo.nextLevel}</span>
            <span>{rewardProgress} orders</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${tierInfo.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {rewardProgress}
          </div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {tierInfo.discount}%
          </div>
          <div className="text-sm text-gray-600">Current Discount</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {tierInfo.level === "Gold" ? "Max" : tierInfo.nextLevel}
          </div>
          <div className="text-sm text-gray-600">Next Tier</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
