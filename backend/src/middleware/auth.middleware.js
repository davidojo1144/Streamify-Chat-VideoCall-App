import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protectRoute = async (req, res, next) => {
try {
    const token = req.cookies.jwt;
    console.log("Auth middleware - Token present:", !!token);
    console.log("Auth middleware - Request origin:", req.get('origin'));
    console.log("Auth middleware - Request headers:", req.headers);

    if(!token){
        console.log("Auth middleware - No token found in cookies");
        return res.status(401).json({message: "Not authorized, token missing"});
    }

    console.log("Auth middleware - Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware - Token decoded successfully");

    if(!decoded){
        console.log("Auth middleware - Token verification failed");
        return res.status(401).json({message: "Not authorized, token invalid"});
    }

    console.log("Auth middleware - Finding user:", decoded.userId);
    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
        console.log("Auth middleware - User not found");
        return res.status(401).json({message: "Not authorized, user not found"});
    }

    console.log("Auth middleware - User authenticated successfully");
    req.user = user;
    next();

} catch (error) {
    console.error("Auth middleware - Error verifying token:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
}
};

export default protectRoute;
