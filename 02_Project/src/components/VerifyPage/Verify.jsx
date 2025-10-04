import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { StoreContext } from "../../Context/StoreContext";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { url, token, clearCart } = useContext(StoreContext);

  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("Verifying payment...");
  const [order, setOrder] = useState(null);
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const success = searchParams.get("success");

      console.log("Verify payment called with:", { sessionId, success, token }); // Debug log

      if (!token) {
        setStatus("error");
        setMessage("You must be logged in to verify payment.");
        return;
      }

      if (success === "true" && sessionId) {
        try {
          console.log(
            "Making API call to:",
            `${url}/api/orders/confirm?session_id=${sessionId}`
          ); // Debug log

          const response = await fetch(
            `${url}/api/orders/confirm?session_id=${sessionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("API response status:", response.status); // Debug log

          const data = await response.json();
          console.log("API response data:", data); // Debug log

          if (response.ok) {
            setStatus("success");
            setMessage("Payment successful! Order confirmed.");
            setOrder(data);

            // Clear the cart only once upon successful payment
            if (!cartCleared) {
              clearCart();
              setCartCleared(true);
            }
          } else {
            setStatus("error");
            setMessage(data.message || "Payment verification failed.");
          }
        } catch (error) {
          console.error("Verification error:", error); // Debug log
          setStatus("error");
          setMessage("Network error. Please check your orders.");
        }
      } else {
        setStatus("error");
        setMessage("Invalid verification link.");
      }
    };

    verifyPayment();
  }, [searchParams, url, token, clearCart, cartCleared]);

  // Redirect to /my-orders after 3 seconds if payment was successful
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => navigate("/myorders"), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-6">
      <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-gray-600 mb-4 text-sm hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        {/* Status Icon */}
        <div className="text-center mb-4">
          {status === "loading" && (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          )}
          {status === "success" && (
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
          )}
          {status === "error" && (
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          )}
        </div>

        {/* Status Message */}
        <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
          {status === "loading" && "Verifying Payment"}
          {status === "success" && "Success!"}
          {status === "error" && "Error"}
        </h2>
        <p className="text-gray-600 text-center mb-4 text-sm">{message}</p>

        {/* Order Details */}
        {order && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              Order Details
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-medium">#{order._id?.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-green-600 capitalize">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">
                  ₦{order.total?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Items:</span>
                <span className="font-medium">
                  {order.items?.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/myorders")}
            className="w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Continue Shopping
          </button>
        </div>

        {/* Redirect notice */}
        {status === "success" && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Redirecting to orders in 3 seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
