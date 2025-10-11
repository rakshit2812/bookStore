import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SignatureKey = process.env.JWT_KEY;

export const setUser = (user) => {
    if (!SignatureKey) {
      throw new Error("JWT_KEY is not defined in environment variables!7");
    }
    const TokenCode = jwt.sign({
        _id : user._id,
        fullname : user.fullname,
        email : user.email,     
    }, SignatureKey,)
    // console.log(TokenCode);
    return TokenCode
}

export const getUser = (token) => {
    if (!SignatureKey) {
      throw new Error("JWT_KEY is not defined in environment variables!20");
    }
    if(!token){
        console.log("token not found");
        return null;
    }
    try {
        if (!SignatureKey) {
          throw new Error("JWT_KEY is not defined in environment variables!28");
        }
        return jwt.verify(token , SignatureKey,)
    } catch (error) {
        console.log("Error encountered in getting user", error);
    }
}