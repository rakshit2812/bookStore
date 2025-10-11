import User from "../models/user.js"
import bcryptjs from "bcryptjs";
import { setUser } from "../service/Auth.js";
// import mongoose from "mongoose";

export const handleSignup = async(req,res) => {
    try {
        const {fullname,email,password} = req.body;
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
        const token = setUser(newUser);
        return res.status(201).json({message : "User created succesfully" , token : token ,user : {
            fullname : newUser.fullname,
            email : newUser.email,
            id : newUser._id,
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
            res.cookie("id" , token,{
                path : "/",
                domain : "localhost",
            });
            return res.status(200).json({message : "Login successfull", user : {
                fullname : user.fullname,
                email : user.email,
                // id : user._id,
            }})
    } catch (error) {
        console.log("login error" , error);
        return res.status(500).json({message : "Internal server error"});
    }
}