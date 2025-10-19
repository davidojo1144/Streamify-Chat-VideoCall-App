import express from "express";
import authRoutes from "./routes/auth.route.js"; 
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

const app = express();
const PORT = process.env.PORT || 5001;

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, postman, or server-side requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "https://streamify-jfol.vercel.app", 
      "https://streamify-weld-iota.vercel.app",
      "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    
    // Check if origin is in allowed list or is a subdomain of your main domain
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    } else {
      console.log('🚫 Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400 // 24 hours for preflight cache
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Security and performance middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging middleware (less verbose in production)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Origin:', req.headers.origin);
  }
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Health check and test routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get("/api/test-cors", (req, res) => {
  res.json({ 
    message: "CORS is working!",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 Streamify Backend Server is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    docs: "Visit /api/health for health check"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      message: 'CORS policy blocked the request',
      allowedOrigins: [
        "https://streamify-jfol.vercel.app", 
        "https://streamify-weld-iota.vercel.app",
        "http://localhost:5174"
      ],
      yourOrigin: req.headers.origin
    });
  }
  
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Database connection
const dbConnection = connectDB();

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 CORS enabled for:`, [
    "https://streamify-jfol.vercel.app", 
    "https://streamify-weld-iota.vercel.app",
    "http://localhost:5174"
  ]);
  console.log(`📊 Database status: ${dbConnection ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
});