dotenv.config();
import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import bookRoute from "./routes/book_route.js";
import userRoute from "./routes/user_route.js";


const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 4000;
const URL = process.env.MONGO_URL

mongoose.connect(URL).then(()=> console.log("MongoDB conncted succesfully.")).catch((error)=> console.log("Caught into an error",error))

app.use(cors({
    credentials : true,
    origin : "http://localhost:5173"
}));
app.use(express.json());
app.use(express.urlencoded({extended : false}));


app.use("/book", bookRoute);
app.use("/user", userRoute);
app.listen(PORT, ()=> console.log(`server started successfully on port ${PORT}`));