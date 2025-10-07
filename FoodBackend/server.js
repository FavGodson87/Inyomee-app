import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRoute.js";
import itemRouter from "./routes/itemsRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import favoritesRouter from "./routes/favoritesRoute.js";
import router from "./routes/settingsRoute.js";
import adminRouter from "./routes/adminRouter.js";

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARE
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:4000",
        "https://inyomee-app.onrender.com",
        "https://www.inyomee-app.onrender.com",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// DATABASE
connectDB();

// INITIAL ADMIN
const createInitialAdmin = async () => {
  try {
    const Admin = (await import("./models/adminModal.js")).default;
    const adminExists = await Admin.findOne({ email: "admin@inyomee.com" });

    if (!adminExists) {
      const admin = new Admin({
        username: "superadmin",
        name: "Super Admin",
        email: "admin@inyomee.com",
        password: "admin123456",
        role: "super_admin",
        permissions: {
          manageUsers: true,
          manageProducts: true,
          manageOrders: true,
          manageSettings: true,
        },
      });

      await admin.save();
      console.log("INITIAL ADMIN CREATED SUCCESSFULLY!");
      console.log("Email: admin@inyomee.com");
      console.log("Password: admin123456");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.log("Admin creation note:", error.message);
  }
};

createInitialAdmin();

// ROUTES
app.use("/api/user", userRouter);
app.use("/api/settings", router);
app.use("/api/items", itemRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/admin", adminRouter); // Moved this up with other API routes

// UPLOADS - Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debug middleware for asset requests
app.use((req, res, next) => {
  if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    console.log("Asset request:", req.method, req.path);
  }
  next();
});

// PRODUCTION static file serving - FIXED
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../02_Project/dist");
  console.log("Serving static files from:", distPath);

  // Serve static files from dist directory
  app.use(
    express.static(distPath, {
      index: false, // Don't serve index.html for directories
      fallthrough: true, // Continue to next middleware if file not found
    })
  );

  // Handle SPA routing - serve index.html for all non-API routes
  app.get(/\/(?!api).*/, (req, res) => {
    console.log("SPA route requested:", req.path);
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Root route
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// 404 handler for API routes
// app.use("/api/*", (req, res) => {
//   res.status(404).json({
//     error: "API endpoint not found",
//     path: req.originalUrl,
//   });
// });

// Global error handler
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

app.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
