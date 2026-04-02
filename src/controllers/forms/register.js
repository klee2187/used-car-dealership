import { Router } from "express";
import { body, validationResult } from "express-validator";
import { createUser, getUserByEmail} from "../../models/user/User.js";
import bcrypt from "bcrypt";

export const router = Router();

const errors = validationResult(req);

if (!errors.isEmpty()) {
    req.flash("error", "Please fix the errors in the form and try again");
    return res.render("forms/auth/register", {
        title: "Sign Up Here",
        error: errors.array(),
        old: req.body
    });
}

export const registerValidation = [
    body("first_name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("First name must be between 2 and 100 characters")
        .matches(/^[a-zA-Z\s"-]+$/)
        .withMessage("First names can only contain letters, spaces, hyphens, and apostrophes"),
    body("last_name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Last name must be between 2 and 100 characters")
        .matches(/^[a-zA-Z\s"-]+$/)
        .withMessage("Last names can only contain letters, spaces, hyphens, and apostrophes"),
    body("username")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be between 3 and 50 characters")
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage("Username can only contain letters, numbers, underscores, and hyphens"),
    body("email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Must be a valid email address")
        .isLength({ max: 255 })
        .withMessage("Email is too long"),
    body("emailConfirm")
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage("Email addresses must match"),
    body("password")
        .isLength({ min: 8, max: 128 })
        .withMessage("Password must be between 8 and 128 characters")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least 1 number")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[!@#$%^&*]/)
        .withMessage("Password must contain at least one special character")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*()_+\-=\[\]{};":"\\|,.<>\/?]/)
        .withMessage("Must contain at least one special character"),
    body("passwordConfirm")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords must match"),
];

// Registration handler
export const registerUser = async (req, res) => {
    
    const { first_name, last_name, username, email, password } = req.body;
    try {
        const existing = await getUserByEmail(email);
        if (existing) {
            return res.render("forms/auth/register", { error: "Email already registered", old: req.body });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await createUser({ 
            first_name, 
            last_name,
            username,
            email, 
            password_hash: hashed, 
            role: "customer"
        });

        req.session.user = user;
        req.flash("success", "Account created successfully. Please log in.");
        res.redirect("/login");

    } catch (error) {
        console.error("Error during registration:", error);
        req.flash("error", "Something went wrong while creating your account. Please try again later.");
        res.status(500).send("Server error during registration");
    }
};

//Routes
router.get("/register", (req, res) => res.render("forms/auth/register"));
router.post("/register", registerValidation, registerUser);