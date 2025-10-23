import { getUser } from "../service/Auth.js";

/**
 * Middleware to validate JWT token and attach user to request
 * This middleware REQUIRES authentication - if no token or invalid token, returns 401
 */
export const requireAuth = (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ 
        message: "Unauthorized - No token provided" 
      });
    }
    
    // Validate and decode token
    const userData = getUser(token);
    
    console.log("👤 User data from token:", userData ? "Valid" : "Invalid");
    
    if (!userData) {
      console.log("❌ Invalid or expired token");
      return res.status(401).json({ 
        message: "Unauthorized - Invalid or expired token" 
      });
    }
    
    // Attach user data to request object for use in controllers
    req.user = userData;
    console.log("✅ Authentication successful for:", userData.email);
    next();
  } catch (error) {
    console.error("❌ Authentication error:", error);
    return res.status(401).json({ 
      message: "Unauthorized - Authentication failed" 
    });
  }
};

/**
 * Middleware to check authentication but allow request to proceed even if not authenticated
 * Sets req.user if valid token exists, otherwise req.user will be null
 */
export const checkAuth = (req, res, next) => {
  try {
    const token = req.cookies?.authToken || req.headers.authorization?.split(" ")[1];
    
    if (token) {
      const userData = getUser(token);
      req.user = userData || null;
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

/**
 * Middleware factory to restrict access to specific roles
 * Usage: restrictTo(['admin']) or restrictTo(['admin', 'user'])
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: "Unauthorized - Please login" 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden - This action requires ${roles.join(' or ')} role` 
      });
    }
    
    next();
  };
};
