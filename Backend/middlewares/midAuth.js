import {getUser} from "../service/Auth.js"

checkForAuthentication = (req, res, next) => {
  const AuthorizationCookieValue = req.cookies?.token;
  req.user = null;
  if (!AuthorizationCookieValue) {
    return next();
  }
    
  const token = AuthorizationCookieValue;
  const user = getUser(token);

  req.user = user;
  return next();
};

// restrictTo = (roles = []) => {
//     return (req,res,next) => {
//         if(!req.user) return res.redirect("/login")
//         if(!roles.includes(req.user.role)) return res.end("UnAuthorized");
//         return next();
//     }
// }
// restrictToLoggedInUserOnly = async(req,res,next) => {
//     if(!userUid) return res.redirect("/login");

//     const user = getUser(token);

//     if(!user) return res.redirect("/login");
//     req.user = user;
//     next();
// }

// checkAuth = async(req,res,next) => {
//     console.log(req.headers['authorization']);
//     const userUid = req.headers['authorization'];
//     const token = userUid?.split("Bearer ")[1];

//     const user = getUser(token);
//     req.user = user;
//     next();
// }

module.exports = {
  checkForAuthentication,
  restrictTo
};
