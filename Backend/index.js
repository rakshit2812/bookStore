import dotenv from "dotenv";
dotenv.config(); // load env first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import bookRoute from "./routes/book_route.js";
import userRoute from "./routes/user_route.js";

const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 4000;
const URL = process.env.MONGO_URL;

mongoose
  .connect(URL)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((error) => console.log("Caught into an error", error));

// CORS middleware (before routes)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Debug origin
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

// Routes
app.use("/book", bookRoute);
app.use("/user", userRoute);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
