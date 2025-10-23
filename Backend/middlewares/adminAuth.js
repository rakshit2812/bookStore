import {getUser} from "../service/Auth.js"

export const checkAdminAuth = (req, res, next) => {
    const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    
    const userData = getUser(token);
    
    if (!userData) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    if (userData.role !== "admin") {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    req.user = userData;
    next();
};
