 import express from "express";
 import authRoutes from "./routes/auth.route.js"; 
 import "dotenv/config";
 import cors from "cors";
 import { connectDB } from "./lib/db.js";
 import cookieParser from "cookie-parser";
 import userRoutes from "./routes/user.route.js";
 import chatRoutes from "./routes/chat.route.js";
 

 const app = express();

 const PORT = process.env.PORT; 

   app.use(cors({
     origin: function (origin, callback) {
       // Allow requests with no origin (mobile apps, etc.)
       if (!origin) return callback(null, true);

       const allowedOrigins = [
         process.env.CLIENT_URL,
         "http://localhost:5174",
         "http://localhost:5173",
         "http://localhost:3000",
         "https://streamify-chat-video-call-app.vercel.app"
       ];

       if (allowedOrigins.includes(origin)) {
         return callback(null, true);
       } else {
         console.log('Blocked origin:', origin);
         return callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true, // allow frontend to send cookies
   }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/chat", chatRoutes);


  const result = connectDB();
 app.listen (PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
 });

 
 app.get("/", (req, res)=> {
  if(result === undefined) {res.status(500).json({message:"Database not working"})}
  else{res.status(200).json({
    message: "Streamify Backend and Mongo Database connected successfully"
  })}
 });
