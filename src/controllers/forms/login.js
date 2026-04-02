import { body, validationResult } from "express-validator";

// Validation rules for login form
const loginValidation = [
    
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
        .isLength({ max:255 })
        .withMessage("Email address is too long"),
    body("password_hash")
        .notEmpty()
        .withMessage("Password is require")
        .isLength({ min: 8, max: 128 })
        .matches(/[0-9]/)
        .withMessage("Password must contain at least 1 number")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least 1 lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least 1 uppercase letter")
        .matches(/[\W_]/)
        .withMessage("Password must contain at least 1 special character"),
];

// Display the login form page
const showLoginForm = (req, res) => {

    res.render("forms/auth/login", { 
        title : "User Login"})
};

export { loginValidation, showLoginForm };