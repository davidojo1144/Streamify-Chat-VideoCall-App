import express from "express";
import authRoutes from "./routes/auth.route.js"; 
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "https://streamify-jfol.vercel.app", 
      "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('Cookies:', req.cookies);
  console.log('Authorization:', req.headers.authorization);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Test route to verify CORS and authentication
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "CORS is working!",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin 
  });
});

// Health check route
app.get("/", (req, res) => {
  const dbStatus = connectDB() ? "connected" : "disconnected";
  res.status(200).json({
    message: "Streamify Backend is running",
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      message: 'CORS policy blocked the request',
      allowedOrigins: ["https://streamify-jfol.vercel.app", "http://localhost:5174", "http://localhost:5173"]
    });
  }
  
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to database
const dbConnection = connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 CORS enabled for:`, corsOptions.origin);
  console.log(`📊 Database status: ${dbConnection ? 'Connected' : 'Disconnected'}`);
});