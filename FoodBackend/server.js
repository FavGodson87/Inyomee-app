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
      const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:4000"];
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


// UPLOADS
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ADMIN ROUTES
app.use("/api/admin", adminRouter);

app.use((req, res, next) => {
  if (req.path.match(/\.(css|js)$/)) {
    console.log('Asset request:', req.path);
  }
  next();
});

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../02_Project/dist");
  
  // Serve static files
  app.use(express.static(distPath));
  
  // Only for non-API routes that don't have file extensions
  app.get(/^\/(?!api)[^.]*$/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
});
