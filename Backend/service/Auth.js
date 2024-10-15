import jwt from "jsonwebtoken";

const SignatureKey = "Rakshit#@28!5%";

export const setUser = (user) => {
    const TokenCode = jwt.sign({
        _id : user._id,
        fullname : user.fullname,
        email : user.email,     
    }, SignatureKey,)
    // console.log(TokenCode);
    return TokenCode
}

export const getUser = (token) => {
    if(!token){
        console.log("token ille");
        return null;
    }
    try {
        return jwt.verify(token , SignatureKey,)
    } catch (error) {
        console.log("aiioo gadbad hoti", error);
    }
}