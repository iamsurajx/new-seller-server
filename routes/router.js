// Importing modules
import express from "express";
// Create a new router instance
const router = express.Router();

import { signupValidator, loginValidator } from "../middlewares/authValidation.js";
import { signup, login } from "../controller/auth.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";

// Signup route
router.post("/signup", signupValidator, validateRequest, signup);

// Login route
router.post("/login", loginValidator, validateRequest, login);

//Default route to check express is working or not
router.get("/", (req, res) => {
  res.send("<h1>ExpressJS...</h1>");
});

// Export the router
export default router;
