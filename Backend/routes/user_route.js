import express from "express";
import {handleSignup, handleLogin, handleLogout, handleGetCurrentUser} from "../controllers/user_func.js"
import {requireAuth} from "../middlewares/midAuth.js"

const router = express.Router();

router.post("/signup" , handleSignup);
router.post("/login" , handleLogin);
router.post("/logout", handleLogout);
router.get("/me", requireAuth, handleGetCurrentUser);
router.get("/login" , (req,res)=>{
    res.end("login")
});

export default router
