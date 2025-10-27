import User from "../models/user.js"
import bcryptjs from "bcryptjs";
import { setUser } from "../service/Auth.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

// Configure Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our db
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, return the user
          return done(null, user);
        }

        // Check if a user with this email already exists
        let existingEmailUser = await User.findOne({ 
          email: profile.emails[0].value 
        });

        if (existingEmailUser) {
          // Link Google account to existing user
          existingEmailUser.googleId = profile.id;
          if (!existingEmailUser.avatar && profile.photos?.[0]?.value) {
            existingEmailUser.avatar = profile.photos[0].value;
          }
          await existingEmailUser.save();
          return done(null, existingEmailUser);
        }

        // Create new user
        const newUser = await User.create({
          googleId: profile.id,
          fullname: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos?.[0]?.value || ""
        });

        done(null, newUser);
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Password strength validator function
const validatePasswordStrength = (password) => {
    const errors = [];
    
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number");
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push("Password must contain at least one special character (!@#$%^&*)");
    }
    
    return errors;
};

export const handleSignup = async(req,res) => {
    try {
        const {fullname,email,password} = req.body;
        
        // Validate password strength
        const passwordErrors = validatePasswordStrength(password);
        if (passwordErrors.length > 0) {
            return res.status(400).json({
                message: "Password does not meet security requirements",
                errors: passwordErrors
            });
        }
        
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message : "User already exist"});
        }
        const hashPass = await bcryptjs.hash(password,10);
        const newUser = await User.create({
            fullname,
            email,
            password : hashPass,
        })
        // const token = setUser(newUser);
        return res.status(201).json({message : "User created succesfully" ,user : {
            fullname : newUser.fullname,
            email : newUser.email,
            id : newUser._id,
            role : newUser.role,
            avatar : newUser.avatar || ""
        }})
    } catch (error) {
        console.log("signup error" , error);
        return res.status(500).json({message : "Internal server error"});
    }
}

export const handleLogin = async(req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!user || !isMatch){
            return res.status(400).json({message : "Invalid credentials"});
        }
            const token = setUser(user);
            
            // Set token in HttpOnly cookie for security (7 days expiry)
            const isProd = process.env.NODE_ENV === 'production';
            res.cookie("authToken" , token, {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? 'None' : 'Lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
                path : "/",
            });
            
            return res.status(200).json({
                message : "Login successfull", 
                user : {
                    fullname : user.fullname,
                    email : user.email,
                    id : user._id,
                    role : user.role,
                    avatar : user.avatar || ""
                }
            })
    } catch (error) {
        console.log("login error" , error);
        return res.status(500).json({message : "Internal server error"});
    }
}

export const handleLogout = async(req, res) => {
    try {
        // Clear the authentication cookie
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: "/"
        });
        
        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        console.log("logout error", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

// Google OAuth Callback Handler
export const handleGoogleCallback = async(req, res) => {
    try {
        const user = req.user;
        if (!user) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            return res.redirect(`${frontendUrl}/login?error=authentication_failed`);
        }

        // Generate JWT token
        const token = setUser(user);
        
        // Set token in HttpOnly cookie
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });

        // Redirect to frontend with success
        // Use FRONTEND_URL from env, fallback to localhost for development
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        
        if (user.role === "admin") {
            res.redirect(`${frontendUrl}/admin`);
        } else {
            res.redirect(`${frontendUrl}/`);
        }
    } catch (error) {
        console.log("Google callback error", error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/login?error=server_error`);
    }
}

// Get current user from auth token
export const handleGetCurrentUser = async(req, res) => {
    try {
        // req.user is populated by requireAuth middleware
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Return user data (without sensitive information)
        return res.status(200).json({
            fullname: user.fullname,
            email: user.email,
            id: user._id,
            role: user.role,
            avatar: user.avatar || ""
        });
    } catch (error) {
        console.log("Get current user error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { passport };