import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import Router from "./routes/router.js";
import ProductRouter from "./routes/product.routes.js";

// Initialize express app
const app = express();

// Configure environment variables
dotenv.config();

// ============================
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===========================

// Connect to MongoDB
const mongo_url = process.env.mongo_url;
mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });


// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", Router).use("/", ProductRouter);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Live: http://localhost:${PORT}`);
});
