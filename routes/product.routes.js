import express from "express";
import multer from "multer";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";


const router = express.Router();


// Multer setup to save files to 'uploads' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage });


// Routes

// Create a product with both image and video
router.post("/add-product", upload.fields([{ name: "image" }, { name: "video" }]), createProduct); 

// router.post("/add-product", upload.single("image"), createProduct); //create a product

router.get("/products", getAllProducts); // get all the products
router.get("/products/:id", getProductById); // Get a single product by ID
router.put("/products/:id", upload.single("image"), updateProduct); // update a product by id
router.delete("/products/:id", deleteProduct); //delete a product by id

export default router;


// import express from "express";
// import multer from "multer";
// import {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// } from "../controller/product.controller.js";

// const router = express.Router();

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Specify the directory to save uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // Append timestamp to avoid filename collisions
//   },
// });

// const upload = multer({ storage });

// // Routes
// // Create Product (with image and video upload)
// router.post(
//   "/products",
//   upload.fields([
//     { name: "imageFile", maxCount: 1 },
//     { name: "videoFile", maxCount: 1 },
//   ]),
//   createProduct
// );

// // Get All Products
// router.get("/products", getAllProducts);

// // Get Single Product by ID
// router.get("/products/:id", getProductById);

// // Update Product (with optional image and video upload)
// router.put(
//   "/products/:id",
//   upload.fields([
//     { name: "imageFile", maxCount: 1 },
//     { name: "videoFile", maxCount: 1 },
//   ]),
//   updateProduct
// );

// // Delete Product by ID
// router.delete("/products/:id", deleteProduct);

// export default router;

// import express from "express";
// import multer from "multer";
// import {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// } from "../controller/product.controller.js";

// const router = express.Router();

// // Multer setup to save files to 'uploads' folder
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// // Routes
// router.post("/add-product", upload.single("image"), createProduct); //create a product
// router.get("/products", getAllProducts); // get all the products
// router.get("/products/:id", getProductById); // Get a single product by ID
// router.put("/products/:id", upload.single("image"), updateProduct); // update a product by id
// router.delete("/products/:id", deleteProduct); //delete a product by id

// export default router;
