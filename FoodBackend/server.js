import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Your other imports...
const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like same-origin requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://localhost:4000", 
        "https://inyomee-app.onrender.com"
      ];
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS blocked for origin:', origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Connect to MongoDB (from your db.js)
connectDB();

// Your routes
app.use("/api/user", userRouter);
app.use("/api/settings", router);
app.use("/api/items", itemRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/admin", adminRouter);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Production static file serving
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../02_Project/dist");
  
  console.log('Serving static files from:', distPath);
  
  // Serve static files
  app.use(express.static(distPath));
  
  // Handle client-side routing
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api/")) {
      return next();
    }
    
    // Serve React app for all other routes
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        console.error("Error serving React app:", err);
        next(err);
      }
    });
  });
}

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "API WORKING", 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

app.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});