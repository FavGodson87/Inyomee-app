import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import CustomDropdown from "../../components/CustomDropdown";
import {
  Calendar,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError("Please log in to view your orders");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${url}/api/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();
        console.log("Orders data:", data);
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [url, token]);

  useEffect(() => {
    let result = orders;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500 mb-1" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-blue-500 mb-1 " />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Package className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getDisplayStatus = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "processing":
        return "Processing";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    const options = { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const hasIncompleteAddress = (order) => {
    return order.address === "Address not set" || 
           order.city === "City not set" || 
           order.state === "State not set";
  };

  const getFullAddress = (order) => {
    if (hasIncompleteAddress(order)) {
      return "Address not completed - Please update in Settings";
    }
    
    const addressParts = [
      order.address,
      order.city,
      order.state,
      order.zipCode,
      order.country
    ].filter(part => part && part !== "Zip not set" && part !== "Country not set");
    
    return addressParts.join(", ");
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center mt-20">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            Failed to load orders
          </h3>
          <p className="text-neutral-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-6 mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="">
              <h1 className="text-2xl font-bold text-neutral-900">My Orders</h1>
              <p className="text-neutral-600 mt-1">
                View your order history and track current orders
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-5 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="min-w-[160px]">
                <CustomDropdown
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={statusOptions}
                  placeholder="Select status"
                  className="w-full"
                  buttonClassName="px-4 py-2 rounded-lg border border-neutral-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-neutral-900 mb-2">
                {orders.length === 0 ? "No orders yet" : "No matching orders"}
              </h3>
              <p className="text-neutral-500 mb-4">
                {orders.length === 0
                  ? "Start shopping to see your orders here!"
                  : "Try adjusting your search or filter criteria."}
              </p>
              {orders.length === 0 && (
                <button 
                  onClick={() => navigate('/')}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                >
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* Order Header */}
                <div className="border-b border-neutral-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        Order #{order._id.slice(-8)}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {getDisplayStatus(order.status)}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                      <Calendar className="w-4 h-4 mb-1" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 text-lg font-semibold">
                    ₦{order.total?.toLocaleString() || "0"}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 space-y-3">
                  {order.items.map((orderItem, index) => {
                    const item = orderItem.item || {};
                    const itemName = item.name || "Unknown Item";
                    const itemPrice = Number(item.price) || 0;
                    const quantity = Number(orderItem.quantity) || 0;
                    const totalPrice = itemPrice * quantity;

                    return (
                      <div
                        key={index}
                        className="flex justify-between text-sm px-3 py-2 bg-neutral-50 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500">{quantity}x</span>
                          <span>{itemName}</span>
                        </div>
                        <span className="text-neutral-700">
                          ₦{totalPrice.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Address Warning */}
                {hasIncompleteAddress(order) && (
                  <div className="px-4 py-2 bg-yellow-50 border-l-4 border-yellow-400">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">
                        Complete your address in Settings for faster delivery
                      </span>
                    </div>
                  </div>
                )}

                {/* Order Footer */}
                <div className="bg-neutral-50 px-5 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4 mb-1" />
                    <span className={hasIncompleteAddress(order) ? "text-yellow-600" : ""}>
                      {getFullAddress(order)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-neutral-500 hover:text-neutral-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-neutral-700 mb-2">
                      Order Information
                    </h3>
                    <p className="text-sm">
                      <span className="font-medium">Order ID:</span> #
                      {selectedOrder._id.slice(-8)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Date:</span>{" "}
                      {formatDateTime(selectedOrder.createdAt)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getDisplayStatus(selectedOrder.status)}
                      </span>
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-neutral-700 mb-2">
                      Payment Information
                    </h3>
                    <p className="text-sm">
                      <span className="font-medium">Method:</span>{" "}
                      {selectedOrder.paymentMethod === "online" ? "Online Payment" : 
                       selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : 
                       selectedOrder.paymentMethod}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          selectedOrder.paymentStatus === "succeeded"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Total:</span> ₦
                      {selectedOrder.total?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-700 mb-3">Order Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Order placed - {formatDateTime(selectedOrder.createdAt)}</span>
                    </div>
                    {selectedOrder.status === "delivered" && selectedOrder.updatedAt && (
                      <div className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Delivered - {formatDateTime(selectedOrder.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-700 mb-2">
                    Delivery Information
                  </h3>
                  {hasIncompleteAddress(selectedOrder) && (
                    <div className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 mb-1 text-yellow-600" />
                        <span className="text-sm text-yellow-700 font-medium">
                          Address Incomplete
                        </span>
                      </div>
                      <p className="text-sm text-yellow-600 mt-1">
                        Please update your address in Settings for future orders
                      </p>
                    </div>
                  )}
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Name:</span> {selectedOrder.firstName} {selectedOrder.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {selectedOrder.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {selectedOrder.phoneNumber}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Address:</span> {getFullAddress(selectedOrder)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-700 mb-3">
                    Order Items ({selectedOrder.items.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((orderItem, index) => {
                      const item = orderItem.item || {};
                      const itemName = item.name || "Unknown Item";
                      const itemPrice = Number(item.price) || 0;
                      const quantity = Number(orderItem.quantity) || 0;
                      const totalPrice = itemPrice * quantity;

                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-neutral-50 rounded-md"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-neutral-500 font-medium">
                              {quantity}x
                            </span>
                            <span className="text-neutral-800">{itemName}</span>
                          </div>
                          <span className="text-neutral-700 font-medium">
                            ₦{totalPrice.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-neutral-700 mb-3">
                    Price Breakdown
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        ₦
                        {selectedOrder.subtotal?.toLocaleString() ||
                          selectedOrder.total?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>
                        ₦{selectedOrder.shipping?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>₦{selectedOrder.tax?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Total:</span>
                      <span>₦{selectedOrder.total?.toLocaleString() || "0"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t px-6 py-4 flex justify-between">
                {hasIncompleteAddress(selectedOrder) && (
                  <button
                    onClick={() => {
                      setShowOrderDetails(false);
                      navigate('/settings');
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-yellow-600 text-sm"
                  >
                    Update Address
                  </button>
                )}
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="bg-green-500 text-white px-6 py-2 cursor-pointer rounded-lg hover:bg-green-600 ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;