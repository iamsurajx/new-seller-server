import Product from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const createProduct = async (req, res) => {
  const {
    product_name,
    product_description,
    category,
    seller_id,
    product_type,
    original_price,
    sale_price,
  } = req.body;

  const imageFile = req.files["image"] ? req.files["image"][0] : null; // Access image file
  const videoFile = req.files["video"] ? req.files["video"][0] : null; // Access video file

  try {
    let imageUrl;
    if (imageFile) {
      const imageResult = await cloudinary.uploader.upload(imageFile.path);
      imageUrl = imageResult.secure_url;
      await fs.promises.unlink(imageFile.path); // Delete local image file after upload
    }

    let videoUrl;
    if (videoFile) {
      const videoResult = await cloudinary.uploader.upload(videoFile.path, {
        resource_type: "video",
      });
      videoUrl = videoResult.secure_url;
      await fs.promises.unlink(videoFile.path); // Delete local video file after upload
    }

    // Create product in MongoDB
    const product = new Product({
      product_name,
      product_description,
      category,
      seller_id,
      product_type,
      original_price,
      sale_price,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error); // Log error details
    if (imageFile) await fs.promises.unlink(imageFile.path);
    if (videoFile) await fs.promises.unlink(videoFile.path);

    res
      .status(500)
      .json({ error: "Failed to create product", details: error.message });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve products", details: error.message });
  }
};

// Get Single Product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve product", details: error.message });
  }
};

// Update Product by ID
export const updateProduct = async (req, res) => {
  const { id } = req.params; // Ensure this matches with route param
  const updates = req.body;
  const imageFile = req.files['image'] ? req.files['image'][0] : null; // New image file if provided
  const videoFile = req.files['video'] ? req.files['video'][0] : null; // New video file if provided

  try {
    // Find the existing product
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // If a new image is provided, upload it to Cloudinary and update the imageUrl
    if (imageFile) {
      // Delete the old image from Cloudinary
      if (product.imageUrl) {
        const publicIdImage = product.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicIdImage);
      }

      // Upload the new image
      const resultImage = await cloudinary.uploader.upload(imageFile.path);
      updates.imageUrl = resultImage.secure_url;

      // Delete the local file after upload
      await fs.promises.unlink(imageFile.path);
    }

    // If a new video is provided, upload it to Cloudinary and update the videoUrl
    if (videoFile) {
      // Delete the old video from Cloudinary if it exists
      if (product.videoUrl) {
        const publicIdVideo = product.videoUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicIdVideo, { resource_type: 'video' });
      }

      // Upload the new video
      const resultVideo = await cloudinary.uploader.upload(videoFile.path, { resource_type: 'video' });
      updates.videoUrl = resultVideo.secure_url;

      // Delete the local file after upload
      await fs.promises.unlink(videoFile.path);
    }

    // Update the product fields with any other updates provided in the body
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    if (imageFile) await fs.promises.unlink(imageFile.path);
    if (videoFile) await fs.promises.unlink(videoFile.path);
    
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
};

// Delete Product by ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product
    const product = await Product.findById(id);
    
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Delete the image from Cloudinary if it exists
    if (product.imageUrl) {
      const publicIdImage = product.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicIdImage);
    }

    // Delete the video from Cloudinary if it exists
    if (product.videoUrl) {
      const publicIdVideo = product.videoUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicIdVideo, { resource_type: 'video' });
    }

    // Delete the product from MongoDB
    await Product.findByIdAndDelete(id); 
   
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
   res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
};


// import Product from '../models/product.model.js';
// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';

// // Create Product
// export const createProduct = async (req, res) => {
//   const {
//     product_name,
//     product_description,
//     category,
//     seller_id,
//     product_type,
//     original_price,
//     sale_price
//   } = req.body;
//   const imageFile = req.file; // Image file
//   const videoFile = req.videoFile; // Video file

//   try {
//     // Upload image to Cloudinary
//     let imageUrl;
//     if (imageFile) {
//       const imageResult = await cloudinary.uploader.upload(imageFile.path);
//       imageUrl = imageResult.secure_url;
//       // Delete local image file after uploading to Cloudinary
//       await fs.promises.unlink(imageFile.path);
//     }

//     // Upload video to Cloudinary
//     let videoUrl;
//     if (videoFile) {
//       const videoResult = await cloudinary.uploader.upload(videoFile.path, {
//         resource_type: 'video' // Specify that this is a video upload
//       });
//       videoUrl = videoResult.secure_url;
//       // Delete local video file after uploading to Cloudinary
//       await fs.promises.unlink(videoFile.path);
//     }

//     // Create product in MongoDB
//     const product = new Product({
//       product_name,
//       product_description,
//       category,
//       seller_id,
//       product_type,
//       original_price,
//       sale_price,
//       imageUrl: imageUrl || null,
//       videoUrl: videoUrl || null, // Store the video URL if available
//     });

//     await product.save();

//     res.status(201).json(product);
//   } catch (error) {
//     // Delete local files in case of error
//     if (imageFile) await fs.promises.unlink(imageFile.path);
//     if (videoFile) await fs.promises.unlink(videoFile.path);

//     res.status(500).json({ error: "Failed to create product", details: error.message });
//   }
// };

// // Get All Products
// export const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve products" });
//   }
// };

// // Get Single Product
// export const getProductById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const product = await Product.findById(id);
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     res.status(200).json(product);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to retrieve product", details: error.message });
//   }
// };

// // Update Product
// export const updateProduct = async (req, res) => {
//   const { id } = req.params; // Ensure this matches with route param
//   const updates = req.body;
//   const imageFile = req.file; // New image file if provided
//   const videoFile = req.videoFile; // New video file if provided

//   try {
//     // Find the existing product
//     const product = await Product.findById(id);
//     if (!product) return res.status(404).json({ error: "Product not found" });

//     // If a new image is provided, upload it to Cloudinary and update the imageUrl
//     if (imageFile) {
//       // Delete the old image from Cloudinary
//       const publicIdImage = product.imageUrl.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(publicIdImage);

//       // Upload the new image
//       const resultImage = await cloudinary.uploader.upload(imageFile.path);
//       updates.imageUrl = resultImage.secure_url;

//       // Delete the local file after upload
//       await fs.promises.unlink(imageFile.path);
//     }

//     // If a new video is provided, upload it to Cloudinary and update the videoUrl
//     if (videoFile) {
//       // Delete the old video from Cloudinary if it exists
//       if (product.videoUrl) {
//         const publicIdVideo = product.videoUrl.split("/").pop().split(".")[0];
//         await cloudinary.uploader.destroy(publicIdVideo, {
//           resource_type: "video",
//         });
//       }

//       // Upload the new video
//       const resultVideo = await cloudinary.uploader.upload(videoFile.path, {
//         resource_type: "video",
//       });

//       updates.videoUrl = resultVideo.secure_url;

//       // Delete the local file after upload
//       await fs.promises.unlink(videoFile.path);
//     }

//     // Update the product fields with any other updates provided in the body
//     const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
//       new: true,
//     });

//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     if (imageFile) await fs.promises.unlink(imageFile.path);
//     if (videoFile) await fs.promises.unlink(videoFile.path);

//     res
//       .status(500)
//       .json({ error: "Failed to update product", details: error.message });
//   }
// };

// // Delete Product
// export const deleteProduct = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find the product
//     const product = await Product.findById(id);

//     if (!product) return res.status(404).json({ error: "Product not found" });

//     // Delete the image from Cloudinary if it exists
//     if (product.imageUrl) {
//       const publicIdImage = product.imageUrl.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(publicIdImage);
//     }

//     // Delete the video from Cloudinary if it exists
//     if (product.videoUrl) {
//       const publicIdVideo = product.videoUrl.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(publicIdVideo, {
//         resource_type: "video",
//       });
//     }

//     // Delete the product from MongoDB
//     await Product.findByIdAndDelete(id);

//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to delete product", details: error.message });
//   }
// };

// import Product from '../models/product.model.js';
// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';

// // Create Product
// export const createProduct = async (req, res) => {
//   const {
//     product_name,
//     product_description,
//     category,
//     seller_id,
//     product_type,
//     original_price,
//     sale_price
//   } = req.body;
//   const file = req.file;

//   try {
//     // Upload image to Cloudinary
//     const result = await cloudinary.uploader.upload(file.path);

//     // Create product in MongoDB
//     const product = new Product({
//       product_name,
//       product_description,
//       category,
//       seller_id,
//       product_type,
//       original_price,
//       sale_price,
//       imageUrl: result.secure_url,
//     });
//     await product.save();

//     // Delete local file after uploading to Cloudinary
//     await fs.promises.unlink(file.path);

//     res.status(201).json(product);
//   } catch (error) {
//     // Delete local file in case of error
//     if (file) await fs.promises.unlink(file.path);
//     res.status(500).json({ error: "Failed to create product", details: error.message });
//   }
// };

// // Get All Products
// export const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve products" });
//   }
// };

// //get product by id
// // Get Single Product
// export const getProductById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const product = await Product.findById(id);
//     if (!product) return res.status(404).json({ error: "Product not found" });
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve product", details: error.message });
//   }
// };

// // Update Product
// export const updateProduct = async (req, res) => {
//   const { id } = req.params; // Ensure this matches with route param
//   const updates = req.body;
//   const file = req.file;

//   try {
//     // Find the existing product
//     const product = await Product.findById(id);
//     if (!product) return res.status(404).json({ error: 'Product not found' });

//     // If a new image is provided, upload it to Cloudinary and update the imageUrl
//     if (file) {
//       // Delete the old image from Cloudinary
//       const publicId = product.imageUrl.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);

//       // Upload the new image
//       const result = await cloudinary.uploader.upload(file.path);
//       updates.imageUrl = result.secure_url;

//       // Delete the local file after upload
//       await fs.promises.unlink(file.path);
//     }

//     // Update the product fields
//     const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     if (file) await fs.promises.unlink(file.path);
//     res.status(500).json({ error: 'Failed to update product', details: error.message });
//   }
// };

// // Delete Product
// export const deleteProduct = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find the product
//     const product = await Product.findById(id);
//     if (!product) return res.status(404).json({ error: 'Product not found' });

//     // Delete the image from Cloudinary
//     const publicId = product.imageUrl.split('/').pop().split('.')[0];
//     await cloudinary.uploader.destroy(publicId);

//     // Delete the product from MongoDB
//     await Product.findByIdAndDelete(id); // Corrected deletion method
//     res.status(200).json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete product', details: error.message });
//   }
// };
