import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
