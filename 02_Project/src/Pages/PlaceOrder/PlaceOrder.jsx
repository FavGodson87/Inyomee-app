import React, { useContext, useEffect, useState, useMemo } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Plus, Home } from "lucide-react";
import CustomDropdown from "../../components/CustomDropdown";
import axios from "axios";
import { useModal } from "../../components/Modal/useModal";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    cartItems,
    foodList,
    loadCartData,
    token,
    userData,
    url
  } = useContext(StoreContext);
  
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 200;
  const total = subtotal + deliveryFee;

  const [formData, setFormData] = useState({
    paymentMethod: "cod",
    useSavedAddress: true, // Toggle between address types
  });

  const [customAddress, setCustomAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    label: "" // Optional label
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useModal();

  const handleCustomAddressChange = (e) => {
    const { name, value } = e.target;
    setCustomAddress({ ...customAddress, [name]: value });
  };

  const toggleAddressType = (useSaved) => {
    setFormData({ ...formData, useSavedAddress: useSaved });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        openModal({
          title: "Authentication Error",
          message: "Please log in to place an order.",
        });
        return;
      }

      // Map cart items into order format
      const items = Object.keys(cartItems).map((id) => {
        const food = foodList.find((f) => f._id === id);
        if (!food) {
          console.warn(`Item ${id} not found in foodList`);
        }
        return {
          item: id,
          name: food?.name,
          price: food?.price,
          imageUrl: food?.imageUrl,
          quantity: cartItems[id],
        };
      }).filter(item => item.quantity > 0);

      if (items.length === 0) {
        openModal({
          title: "Empty Cart",
          message: "Your cart is empty. Please add items before ordering.",
        });
        return;
      }

      console.log("Submitting order with:", {
        itemCount: items.length,
        useSavedAddress: formData.useSavedAddress
      });

      // SECURITY: Only send what backend needs
      const orderData = {
        paymentMethod: formData.paymentMethod,
        subtotal,
        tax: 0,
        shipping: deliveryFee,
        total,
        items,
        // Only send custom address if user selected it
        ...(formData.useSavedAddress ? {} : {
          customAddress: {
            street: customAddress.street,
            city: customAddress.city,
            state: customAddress.state,
            zipCode: customAddress.zipCode,
            country: customAddress.country,
            label: customAddress.label
          }
        })
      };

      const res = await axios.post(
        `${url}/api/orders`,
        orderData,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        }
      );

      console.log("Order response:", res.data);

      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        openModal({
          title: "Order Placed Successfully!",
          message: "Your order has been placed and will be delivered soon.",
          onConfirm: () => {
            if (loadCartData) loadCartData(token);
            navigate("/myorders");
          },
        });
      }
    } catch (err) {
      console.error("Order submission error:", err);
      let errorMessage = "Failed to place order. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please check your connection and try again.";
      }
      
      openModal({
        title: "Order Failed",
        message: errorMessage,
      });
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDefaultPayment = async () => {
      if (token) {
        try {
          // Just set payment method, no personal data
          setFormData((prev) => ({ ...prev, paymentMethod: "cod" }));
        } catch (error) {
          console.error("Error loading payment preferences:", error);
          setFormData((prev) => ({ ...prev, paymentMethod: "cod" }));
        }
      } else {
        setFormData((prev) => ({ ...prev, paymentMethod: "cod" }));
      }
      setIsLoading(false);
    };

    loadDefaultPayment();
  }, [token]);

 
const hasSavedAddress = useMemo(() => {
  const address = userData?.settings?.profile?.address;
  return address?.street && address?.city && address?.state;
}, [userData?.settings?.profile?.address]);


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Back Button */}
        <div className="lg:col-span-3 flex items-center gap-2">
          <button
            onClick={() => navigate("/cart")}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer" />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Checkout
          </h1>
        </div>

        {/* Left: Delivery Information */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Delivery Information</h2>

          {/* Address Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Where should we deliver your order?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Saved Address Option */}
              <button
                onClick={() => toggleAddressType(true)}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  formData.useSavedAddress
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span className="font-medium">My Saved Address</span>
                </div>
                {hasSavedAddress ? (
                  <p className="text-sm text-gray-600 mt-1">
                    {userData.settings.profile.address.street}, {userData.settings.profile.address.city}
                  </p>
                ) : (
                  <p className="text-sm text-yellow-600 mt-1">
                    No saved address - Update in Settings
                  </p>
                )}
              </button>

              {/* Custom Address Option */}
              <button
                onClick={() => toggleAddressType(false)}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  !formData.useSavedAddress
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Different Address</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Deliver to work, friend, or other location
                </p>
              </button>
            </div>
          </div>

          {/* Saved Address Display (Read-only) */}
          {formData.useSavedAddress && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Your Saved Address</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Name:</span> {userData?.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {userData?.email}
                </div>
                {userData?.settings?.phone && (
                  <div>
                    <span className="font-medium">Phone:</span> {userData.settings.profile.phone}
                  </div>
                )}
                {hasSavedAddress ? (
                  <>
                    <div>
                      <span className="font-medium">Address:</span> {userData?.settings?.profile?.address?.street}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="font-medium">City:</span> {userData?.settings?.profile?.address?.city}
                      </div>
                      <div>
                        <span className="font-medium">State:</span> {userData?.settings?.profile?.address?.state}
                      </div>
                      <div>
                        <span className="font-medium">ZIP:</span> {userData?.settings?.profile?.address?.zipCode}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Country:</span> {userData?.settings?.profile?.address?.country}
                    </div>
                  </>
                ) : (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-700">
                      Complete your address in Settings for faster checkout
                    </p>
                    <button
                      onClick={() => navigate('/settings')}
                      className="text-sm text-yellow-700 underline mt-1"
                    >
                      Go to Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom Address Form */}
          {!formData.useSavedAddress && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Custom Delivery Address</h3>
              
              <input
                type="text"
                name="label"
                placeholder="Address label (optional) e.g., Work, Friend's House"
                value={customAddress.label}
                onChange={handleCustomAddressChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="text"
                name="street"
                placeholder="Street Address *"
                value={customAddress.street}
                onChange={handleCustomAddressChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={customAddress.city}
                  onChange={handleCustomAddressChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={customAddress.state}
                  onChange={handleCustomAddressChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code *"
                  value={customAddress.zipCode}
                  onChange={handleCustomAddressChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <input
                type="text"
                name="country"
                placeholder="Country *"
                value={customAddress.country}
                onChange={handleCustomAddressChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* Payment Method */}
          <div className="mt-8 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <CustomDropdown
              value={formData.paymentMethod}
              onChange={(value) =>
                setFormData({ ...formData, paymentMethod: value })
              }
              options={[
                { value: "cod", label: "Cash on Delivery" },
                { value: "online", label: "Pay Online" },
              ]}
              placeholder={isLoading ? "Loading..." : "Select Payment Method"}
              className="w-full"
              buttonClassName="px-4 py-3 rounded-xl border border-gray-300"
            />
          </div>
        </div>

        {/* Right: Cart Totals */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-200 shadow-sm flex flex-col justify-between mt-6 lg:mt-0">
          <h2 className="text-2xl font-semibold mb-6">Cart Totals</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₦{subtotal}.00</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>₦{deliveryFee}.00</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₦{total}.00</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!formData.useSavedAddress && (!customAddress.street || !customAddress.city || !customAddress.state)}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-2xl transition-colors"
          >
            {!formData.useSavedAddress && (!customAddress.street || !customAddress.city || !customAddress.state) 
              ? "Please complete delivery address" 
              : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;