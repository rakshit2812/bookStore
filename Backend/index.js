import dotenv from "dotenv";
dotenv.config(); // load env first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { passport, handleGoogleCallback } from "./controllers/user_func.js";

import bookRoute from "./routes/book_route.js";
import userRoute from "./routes/user_route.js";
import cartRoute from "./routes/cart_route.js";
import orderRoute from "./routes/order_route.js";
import favoriteRoute from "./routes/favorite_route.js";
import adminRoute from "./routes/admin_route.js";

const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 4001;
const URL = process.env.MONGO_URL;

mongoose
  .connect(URL)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((error) => console.log("Caught into an error", error));

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/favorite", favoriteRoute);
app.use("/admin", adminRoute);

// Google OAuth Routes (at root level to match Google Cloud Console configuration)
app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false
  }),
  handleGoogleCallback
);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
