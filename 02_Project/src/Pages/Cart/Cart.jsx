import React, { useContext, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { CiDeliveryTruck } from "react-icons/ci";
import { CiGift } from "react-icons/ci";
import { CiCreditCard1 } from "react-icons/ci";
import { Minus, Plus, X, Crown } from "lucide-react";
import Modal from "../../components/Modal/Modal";

const Cart = () => {
  const {
    cartItems,
    foodList,
    removeFromCart,
    getTotalCartAmount,
    addToCart,
    deleteItemCompletely,
    clearCart,
    rewardProgress,
    userData,
    getRewardTierInfo,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const subtotal = getTotalCartAmount();
  const deliveryFee = 853;

  const currentTier = getRewardTierInfo();

  // Apply tier discount if qualified
  const tierDiscount =
    currentTier.discount > 0
      ? Math.round(subtotal * (currentTier.discount / 100))
      : 0;

  const totalBeforeDiscount = subtotal + deliveryFee;
  const finalTotal = totalBeforeDiscount - tierDiscount;


  const handleClearCart = () => {
    clearCart();
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // Reward milestones for display
  const rewardMilestones = [
    {
      target: 30000,
      title: "GET A FREE DESSERT",
      icon: <CiGift className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />,
    },
    {
      target: 50000,
      title: "GET FREE DELIVERY",
      icon: <CiDeliveryTruck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />,
    },
    {
      target: 80000,
      title: "SAVE EXTRA 5% OFF",
      icon: <CiCreditCard1 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-8">
      {/* Confirmation Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />

      <div className="max-w-6xl mx-auto mt-16 sm:mt-20 lg:mt-32">
        {/* User Rewards Header */}
        {userData && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-6 h-6 text-yellow-300" />
                  <h3 className="text-xl font-bold">Your Rewards Status</h3>
                </div>
                <p className="text-blue-100">
                  Level:{" "}
                  <span className="font-semibold text-white">
                    {currentTier.level}
                  </span>{" "}
                  • Completed Orders:{" "}
                  <span className="font-semibold text-white">
                    {rewardProgress}
                  </span>
                </p>
                {currentTier.discount > 0 && (
                  <p className="text-white font-medium mt-1">
                    You qualify for {currentTier.discount}% discount on all
                    orders!
                  </p>
                )}
              </div>

              <div className="text-center bg-white bg-opacity-20 rounded-lg p-3 min-w-[120px]">
                <div className="text-2xl font-bold text-yellow-300">
                  {rewardProgress}
                </div>
                <div className="text-blue-300 text-sm">Orders</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-100">
                  Progress to {currentTier.nextLevel}
                </span>
                <span className="text-white font-medium">
                  {rewardProgress}/
                  {currentTier.nextLevel === "Bronze"
                    ? 3
                    : currentTier.nextLevel === "Silver"
                    ? 5
                    : currentTier.nextLevel === "Gold"
                    ? 10
                    : "Max"}
                </span>
              </div>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                <div
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${currentTier.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              shopping cart
            </h1>
            {Object.keys(cartItems).length > 0 && (
              <button
                onClick={() =>
                  setModalConfig({
                    isOpen: true,
                    title: "Clear Entire Cart?",
                    message:
                      "Are you sure you want to remove all items from your cart? This action cannot be undone.",
                    onConfirm: handleClearCart,
                  })
                }
                className="text-white w-auto h-auto bg-red-600 cursor-pointer
                text-sm font-medium flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-red-500 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            summary
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Shipping/Promo Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {rewardMilestones.map((reward, idx) => {
                const progress = Math.min(subtotal / reward.target, 1) * 100;
                const amountLeft = Math.max(0, reward.target - subtotal);

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {reward.icon}
                      </div>
                      <div>
                        <p className="font-medium text-xs sm:text-sm">
                          {reward.title}
                        </p>
                        <p className="text-base sm:text-lg font-bold">
                          ₦{reward.target.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {progress < 100 && (
                      <p className="text-xs text-gray-600 mb-1">
                        ₦{amountLeft.toLocaleString()} to go
                      </p>
                    )}

                    <div className="w-full bg-amber-200 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Items */}
            <div className="space-y-3 sm:space-y-4">
              {foodList.map((item) => {
                if (cartItems[item._id] > 0) {
                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200"
                    >
                      {/* Mobile Layout */}
                      <div className="flex flex-col sm:hidden gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-pink-100 flex items-center justify-center">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-pink-300 rounded"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {item.category || "product"}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteItemCompletely(item._id)}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {cartItems[item._id]}
                            </span>
                            <button
                              onClick={() => addToCart(item._id)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-lg font-semibold">
                            ₦
                            {(
                              item.price * cartItems[item._id]
                            ).toLocaleString()}
                            .00
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden bg-pink-100 flex items-center justify-center">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-pink-300 rounded"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {item.category || "product"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {cartItems[item._id]}
                            </span>
                            <button
                              onClick={() => addToCart(item._id)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-lg font-semibold min-w-[80px] text-right">
                            ₦
                            {(
                              item.price * cartItems[item._id]
                            ).toLocaleString()}
                            .00
                          </div>

                          <button
                            onClick={() => deleteItemCompletely(item._id)}
                            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}

              {Object.keys(cartItems).length === 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-gray-200">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
              {/* Apply Discount if Qualified */}
              {currentTier.discount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 text-sm font-medium">
                      {currentTier.level} Member Discount (
                      {currentTier.discount}%)
                    </span>
                    <span className="text-green-800 font-bold">
                      -₦
                      {Math.round(
                        subtotal * (currentTier.discount / 100)
                      ).toLocaleString()}
                      .00
                    </span>
                  </div>
                </div>
              )}

              {/* {currentTier.discount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 text-sm font-medium">
                      {currentTier.level} Member Discount (
                      {currentTier.discount}%)
                    </span>
                    <span className="text-green-800 font-bold">
                      -₦{tierDiscount.toLocaleString()}.00
                    </span>
                  </div>
                </div>
              )} */}

              {/* Totals */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">
                    subtotal
                  </span>
                  <span className="font-semibold text-sm sm:text-base">
                    ₦{subtotal.toLocaleString()}.00
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">
                    other processing fee
                  </span>
                  <span className="text-gray-600 text-sm sm:text-base">
                    ₦{deliveryFee}.00
                  </span>
                </div>
              </div>

              <hr className="border-gray-200 mb-4 sm:mb-6" />

              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-900 font-medium text-sm sm:text-base">
                  total
                </span>
                <span className="text-sm sm:text-[15px] font-bold">
                  ₦{totalBeforeDiscount.toLocaleString()}.00
                </span>
              </div>

              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <span className="text-lg sm:text-[20px] font-bold text-gray-900">
                  Grand total
                </span>
                <span className="text-lg sm:text-[20px] font-bold">
                  ₦{finalTotal.toLocaleString()}.00
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/order")}
                className="w-full bg-green-500 hover:bg-green-600 text-white 
                font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl 
                transition-colors cursor-pointer text-sm sm:text-base"
                disabled={Object.keys(cartItems).length === 0}
              >
                {Object.keys(cartItems).length === 0
                  ? "CART IS EMPTY"
                  : "PROCEED TO CHECKOUT"}
              </button>
            </div>

            {/* Promo Code Input */}
            <div className="mt-4 sm:mt-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                If you have a promo code, enter it here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
                <button className="px-4 sm:px-6 py-3 bg-gray-900 text-white font-medium rounded-lg sm:rounded-xl hover:bg-gray-800 transition-colors text-sm sm:text-base">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
