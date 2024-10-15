import express from "express";
import {handleSignup, handleLogin} from "../controllers/user_func.js"

const router = express.Router();

router.post("/signup" , handleSignup);
router.post("/login" , handleLogin);
router.get("/login" , (req,res)=>{
    res.end("login")
});
export default router
