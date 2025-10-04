import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken"); // Add this
      const response = await axios.get(`${url}/api/admin/orders`, {
        // Changed URL
        headers: { Authorization: `Bearer ${token}` }, // Add authorization header
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken"); // Add this
      await axios.put(
        `${url}/api/admin/orders/${orderId}`,
        {
          // Changed URL
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Add authorization header
        }
      );
      toast.success("Order status updated");
      fetchOrders(); // Refresh the list
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Failed to update order status");
    }
  };

  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      const token = localStorage.getItem("adminToken"); // Add this
      await axios.put(
        `${url}/api/admin/orders/${orderId}`,
        {
          // Changed URL
          paymentStatus: newPaymentStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Add authorization header
        }
      );
      toast.success("Payment status updated");
      fetchOrders();
    } catch (err) {
      console.error("Error updating payment status:", err);
      toast.error("Failed to update payment status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "outForDelivery":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <p className="text-xl font-bold mb-4 text-neutral-800">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-neutral-800">
        Customer Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6 border"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-base sm:text-lg">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.firstName} {order.lastName}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {order.email}
                  </p>
                  <p className="text-sm text-gray-600">{order.phoneNumber}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-lg">
                    ₦{order.total?.toLocaleString()}
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-4">
                <h4 className="font-medium text-sm text-gray-700">
                  Delivery Address:
                </h4>
                <p className="text-sm break-words">
                  {order.address}, {order.city}, {order.state} {order.zipCode},{" "}
                  {order.country}
                  {order.isCustomAddress && (
                    <span className="text-blue-600 ml-2">
                      ({order.addressLabel})
                    </span>
                  )}
                </p>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4 mb-4">
                <h4 className="font-medium mb-3 text-sm sm:text-base">
                  Order Items:
                </h4>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <img
                          src={item.item.imageUrl}
                          alt={item.item.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="font-medium truncate block">
                            {item.item.name}
                          </span>
                          <span className="text-gray-500">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-semibold flex-shrink-0 ml-2">
                        ₦{(item.item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₦{order.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>₦{order.tax?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>₦{order.shipping?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold border-t mt-2 pt-2 text-sm sm:text-base">
                  <span>Total:</span>
                  <span>₦{order.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 border-t pt-4">
                <span className="text-sm font-medium flex-shrink-0">
                  Update Status:
                </span>

                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <button
                    onClick={() => updateOrderStatus(order._id, "processing")}
                    className="px-2 sm:px-3 py-1 bg-yellow-500 text-white rounded text-xs sm:text-sm hover:bg-yellow-600 transition-colors"
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order._id, "confirmed")}
                    className="px-2 sm:px-3 py-1 bg-purple-500 text-white rounded text-xs sm:text-sm hover:bg-purple-600 transition-colors"
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() =>
                      updateOrderStatus(order._id, "outForDelivery")
                    }
                    className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded text-xs sm:text-sm hover:bg-blue-600 transition-colors"
                  >
                    Out for Delivery
                  </button>
                  <button
                    onClick={() => updateOrderStatus(order._id, "delivered")}
                    className="px-2 sm:px-3 py-1 bg-green-500 text-white rounded text-xs sm:text-sm hover:bg-green-600 transition-colors"
                  >
                    Delivered
                  </button>
                </div>
              </div>

              {/* Payment Status Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 border-t pt-4 mt-4">
                <span className="text-sm font-medium flex-shrink-0">
                  Payment Status:
                </span>

                <div className="flex flex-wrap gap-1 sm:gap-2">
                  <button
                    onClick={() => updatePaymentStatus(order._id, "succeeded")}
                    className="px-2 sm:px-3 py-1 bg-green-500 text-white rounded text-xs sm:text-sm hover:bg-green-600 transition-colors"
                  >
                    Mark Paid
                  </button>
                  <button
                    onClick={() => updatePaymentStatus(order._id, "pending")}
                    className="px-2 sm:px-3 py-1 bg-yellow-500 text-white rounded text-xs sm:text-sm hover:bg-yellow-600 transition-colors"
                  >
                    Mark Pending
                  </button>
                </div>
              </div>

              {/* Order Meta */}
              <div className="border-t pt-3 mt-4 text-xs text-gray-500 space-y-1">
                <p className="break-all">Order ID: {order._id}</p>
                <p>Payment Method: {order.paymentMethod}</p>
                <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
