import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    index: true,
  },
  product_description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  seller_id: {
    type: String,
  },
  product_type: {
    type: String,
    required: true,
  },
  original_price: {
    type: Number,
  },
  sale_price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  videoUrl: { // New field added for video URL
    type: String, // Assuming a string URL format
    required: false, // Optional field; set to true if you want it to be mandatory
  },
});

export default mongoose.model("Product", productSchema);