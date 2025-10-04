import Stripe from "stripe";
import Order from "../models/orderModal.js";
import { CartItem } from "../models/cartModal.js";
import User from "../models/userModal.js";
import UserSettings from "../models/userSettingsModal.js";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE ORDER FUNCTION
// CREATE ORDER FUNCTION - FIXED VERSION
export const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      subtotal,
      tax,
      total,
      items,
      country,
      shipping, // Only country is accepted from frontend
    } = req.body;

    console.log("🔍 ORDER CREATION STARTED:", {
      user: req.user._id,
      paymentMethod,
      itemCount: items?.length,
      shipping,
    });

    // 🛡️ SECURITY FIX: ENFORCE user data instead of validating submitted data
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      console.log("❌ User not found:", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }

    // Get user settings
    const userSettings = await UserSettings.findOne({ userId: req.user._id });
    console.log("🔍 User settings found:", !!userSettings);

    // ENFORCE user data - ignore any submitted personal info
    // Provide fallbacks for all required fields
    // 🛡️ SECURITY: Handle both saved addresses and custom delivery addresses
    let finalDeliveryData;

    if (req.body.customAddress) {
      // Use custom address for delivery, but keep user's account info
      console.log("📦 Using custom delivery address");
      finalDeliveryData = {
        firstName: currentUser.name?.split(" ")[0] || "Customer",
        lastName: currentUser.name?.split(" ").slice(1).join(" ") || "",
        email: currentUser.email, // Always use account email
        phoneNumber:
          req.body.customAddress.phoneNumber ||
          userSettings?.phone ||
          "Not provided",
        address: req.body.customAddress.street,
        city: req.body.customAddress.city,
        state: req.body.customAddress.state,
        zipCode: req.body.customAddress.zipCode,
        country: req.body.customAddress.country || country || "Nigeria",
        isCustomAddress: true,
        addressLabel: req.body.customAddress.label || "Custom Delivery",
      };
    } else {
      // Use saved user address
      console.log("📦 Using saved address");
      finalDeliveryData = {
        firstName: currentUser.name?.split(" ")[0] || "Customer",
        lastName: currentUser.name?.split(" ").slice(1).join(" ") || "",
        email: currentUser.email,
        phoneNumber: userSettings?.phone || "Not provided",
        address: userSettings?.address?.street || "Address not set",
        city: userSettings?.address?.city || "City not set",
        state: userSettings?.address?.state || "State not set",
        zipCode: userSettings?.address?.zipCode || "Zip not set",
        country: country || userSettings?.address?.country || "Nigeria",
        isCustomAddress: false,
      };
    }

    console.log("🔍 Final delivery data:", finalDeliveryData);

    const enforcedData = finalDeliveryData;

    console.log("🔍 Enforced data:", enforcedData);

    // Log security warnings if frontend sent mismatched data
    if (req.body.email && req.body.email !== currentUser.email) {
      console.warn(
        `SECURITY: User ${req.user._id} attempted order with email ${req.body.email}`
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("❌ Invalid items:", items);
      return res.status(400).json({ message: "Invalid or empty items array" });
    }

    console.log(
      `BACKEND: Creating order for ${enforcedData.email}, total ₦${total}`
    );

    const orderItems = items.map(
      ({ item, name, price, imageUrl, quantity }) => {
        const base = item || {};
        return {
          item: {
            name: base.name || name || "Unknown Item",
            price: Number(base.price ?? price) || 0,
            imageUrl: base.imageUrl || imageUrl || "",
          },
          quantity: Number(quantity) || 0,
        };
      }
    );

    console.log("🔍 Order items processed:", orderItems.length);

    // DEFAULT SHIPPING COST
    const shippingCost = Number(shipping) || 0; // Use the delivery fee from frontend
    let newOrder;

    if (paymentMethod === "online") {
      console.log("BACKEND: Initializing Stripe checkout…");

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: orderItems.map((o) => ({
            price_data: {
              currency: "ngn",
              product_data: {
                name: o.item.name,
                images: o.item.imageUrl ? [o.item.imageUrl] : [],
              },
              unit_amount: Math.round(o.item.price * 100),
            },
            quantity: o.quantity,
          })),
          customer_email: enforcedData.email,
          success_url: `${process.env.FRONTEND_URL}/myorder/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
          metadata: {
            firstName: enforcedData.firstName,
            lastName: enforcedData.lastName,
            email: enforcedData.email,
            phoneNumber: enforcedData.phoneNumber,
          },
        });

        newOrder = new Order({
          user: req.user._id,
          firstName: enforcedData.firstName,
          lastName: enforcedData.lastName,
          phoneNumber: enforcedData.phoneNumber,
          email: enforcedData.email,
          address: enforcedData.address,
          city: enforcedData.city,
          state: enforcedData.state,
          country: enforcedData.country,
          zipCode: enforcedData.zipCode,
          paymentMethod,
          subtotal: subtotal || 0,
          tax: tax || 0,
          total: total || 0,
          shipping: shippingCost,
          items: orderItems,
          paymentIntentId: session.payment_intent,
          sessionId: session.id,
          paymentStatus: "pending",
          isCustomAddress: finalDeliveryData.isCustomAddress,
          addressLabel: finalDeliveryData.addressLabel,
        });

        await newOrder.save();
        console.log(`✅ Order ${newOrder._id} created (online, pending)`);

        return res.status(201).json({
          order: newOrder,
          checkoutUrl: session.url,
        });
      } catch (stripeError) {
        console.error("❌ Stripe error:", stripeError);
        return res.status(500).json({
          message: "Payment processing failed",
          error: stripeError.message,
        });
      }
    }

    // IF PAYMENT IS DONE COD
    console.log("BACKEND: Creating COD order...");
    newOrder = new Order({
      user: req.user._id,
      firstName: enforcedData.firstName,
      lastName: enforcedData.lastName,
      phoneNumber: enforcedData.phoneNumber,
      email: enforcedData.email,
      address: enforcedData.address,
      city: enforcedData.city,
      state: enforcedData.state,
      country: enforcedData.country,
      zipCode: enforcedData.zipCode,
      paymentMethod,
      subtotal: subtotal || 0,
      tax: tax || 0,
      total: total || 0,
      shipping: shippingCost,
      items: orderItems,
      paymentStatus: "succeeded",
      status: "confirmed",
      paymentIntentId: null,
      sessionId: null,
      isCustomAddress: finalDeliveryData.isCustomAddress,
      addressLabel: finalDeliveryData.addressLabel
    });

    await newOrder.save();
    console.log(`✅ Order ${newOrder._id} created (COD, confirmed)`);

    // Clear cart
    await CartItem.deleteMany({ user: req.user._id });
    console.log(`🛒 Cleared cart for user ${req.user._id}`);

    // Update rewards
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { rewardProgress: 1 } },
      { new: true }
    );

    console.log(
      `🎉 Reward progress incremented for user ${req.user._id} → ${updatedUser.rewardProgress}`
    );

    return res.status(201).json({
      order: newOrder,
      checkoutUrl: null,
    });
  } catch (error) {
    console.error("❌ CreateOrder Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// CONFIRM PAYMENT
export const confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id)
      return res.status(400).json({ message: "Session_id required" });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Find the order first
      const order = await Order.findOne({ sessionId: session_id });
      if (!order) return res.status(404).json({ message: "Order not found" });

      // CHECK IF REWARDS WERE ALREADY PROCESSED
      if (order.rewardsProcessed) {
        console.log(
          `BACKEND: Rewards already processed for order ${order._id}`
        );
        return res.json(order);
      }

      // Update order and mark rewards as processed
      const updatedOrder = await Order.findOneAndUpdate(
        { sessionId: session_id },
        {
          paymentStatus: "succeeded",
          status: "confirmed",
          rewardsProcessed: true, // Add this line
        },
        { new: true }
      );

      await CartItem.deleteMany({ user: order.user });

      const updatedUser = await User.findByIdAndUpdate(
        order.user,
        { $inc: { rewardProgress: 1 } },
        { new: true }
      );

      console.log(
        `BACKEND: Reward progress incremented for user ${order.user} → ${updatedUser.rewardProgress}`
      );
      return res.json(updatedOrder);
    }
    return res.status(400).json({ message: "Payment not completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET ORDER
export const getOrder = async (req, res) => {
  try {
    const filter = { user: req.user._id }; // order belongs to that particular user
    const rawOrders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    // FORMAT
    const formatted = rawOrders.map((o) => ({
      ...o,
      items: o.items.map((i) => ({
        _id: i._id,
        item: i.item,
        quantity: i.quantity,
      })),
      createdAt: o.createdAt,
      paymentStatus: o.paymentStatus,
    }));
    res.json(formatted);
  } catch (error) {
    console.error("getOrders Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//  ADMIN ROUTE GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const raw = await Order.find({}).sort({ createdAt: -1 }).lean();

    const formatted = raw.map((o) => ({
      _id: o._id,
      user: o.user,
      firstName: o.firstName,
      lastName: o.lastName,
      phoneNumber: o.phoneNumber,
      email: o.email,
      address: o.address ?? o.shippingAddress?.address ?? "",
      city: o.city ?? o.shippingAddress?.city ?? "",
      state: o.state,
      zipCode: o.zipCode ?? o.shippingAddress?.zipCode ?? "",
      country: o.country,
      isCustomAddress: o.isCustomAddress,
      addressLabel: o.addressLabel,

      subtotal: o.subtotal,
      tax: o.tax,
      shipping: o.shipping,
      total: o.total,

      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      status: o.status,
      createdAt: o.createdAt,

      items: o.items.map((i) => ({
        _id: i._id,
        item: i.item,
        quantity: i.quantity,
      })),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("getAllOrders Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// UPDATE ORDER WITHOUT TOKEN FOR ADMIN
export const updateAnyOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("updateAnyOrder Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET ORDER BY ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    if (req.query.email && order.email !== req.query.email) {
      return res.status(403).json({ message: "Access Denied" });
    }
    res.json(order);
  } catch (error) {
    console.error("getOrderById Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// UPDATE BY ID
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    if (req.body.email && order.email !== req.body.email) {
      return res.status(403).json({ message: "Access Denied" });
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    console.error("getOrderById Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
