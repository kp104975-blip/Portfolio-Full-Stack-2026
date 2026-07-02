const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/connectDB");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const web = require("./routes/web");
const fileupload = require("express-fileupload");

// image and file handling
app.use(fileupload({
    useTempFiles: true
}));
// data base connection
connectDB();


// middleware
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",// client site url
    credentials: true,          // to allow cookies from client
}));

app.use(express.json());// to parse json data from client



// router load
app.use("/api", web); //localhost:5000/api


// server listen
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});