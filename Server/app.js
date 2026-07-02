const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/connectDB");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const web = require("./routes/web");
const fileupload = require("express-fileupload");

// Debug
console.log("🚀 Starting Server...");

// Image & file upload
app.use(
  fileupload({
    useTempFiles: true,
  })
);

// Middleware
app.use(cookieParser());

app.use(
  cors({
    origin: true, // Later replace with your Vercel URL
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api", web);

// Connect DB and Start Server
connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Error");
    console.error(err);
  });