import { Router } from "express";
import { body, validationResult } from "express-validator";
import { createUser, getUserByEmail} from "../../models/user/User.js";
import bcrypt from "bcrypt";

const router = Router();

const registerValidation = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters")
        .matches(/^[a-zA-Z\s"-]+$/)
        .withMessage("Names can only contain letters, spaces, hyphens, and apostrophes"),
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
    
    const { name, email, password } = req.body;
    try {
        const existing = await getUserByEmail(email);
        if (existing) {
            return res.render("auth/register", { error: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await createUser({ 
            name, 
            email, 
            password: hashed, 
            role: "customer"});

        req.session.user = user;
        res.redirect("/dashboard");

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Server error during registration");
    }
};

//Routes
router.get("/register", (req, res) => res.render("auth/register"));
router.post("/register", registerValidation, registerUser);