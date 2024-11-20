import { body } from "express-validator";

// Login validation rules
export const loginValidator = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Signup validation rules
export const signupValidator = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("address.street").notEmpty().withMessage("Street address is required"),
  body("address.city").notEmpty().withMessage("City is required"),
  body("address.state").notEmpty().withMessage("State is required"),
  body("address.postalCode").notEmpty().withMessage("Postal code is required"),
  body("address.country").notEmpty().withMessage("Country is required"),
];