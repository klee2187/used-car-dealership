import { body, validationResult } from "express-validator";
import { findUserByEmail, verifyPassword } from "../../models/forms/login.js";
import bcrypt from "bcrypt";
import { Router } from "express";

const router = Router();

// Validation rules for login form
const loginValidation = [
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("First name is required")
        .matches(/^[a-zA-Z\s\-]+$/)
        .withMessage("First name can only contain letters, spaces, and hyphens")
        .isLength({ max: 100 })
        .withMessage("First name is too long"),
    body("last_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Last name is required")
        .matches(/^[a-zA-Z\s\-]+$/)
        .withMessage("Last name can only contain letters, spaces, and hyphens")
        .isLength({ max: 100 })
        .withMessage("Last name is too long"),
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
        .withMessage("Password must be between 8 and 128"),
    body("role")
        .optional()
        .isIn(["customer", "admin"])
        .withMessage("Invalid role specified")
];

// Display the login form page
const showLoginForm = (req, res) => {

    res.render("forms/auth/login", { 
        title : "User Login"})
};

// Handle login form submission with validation
const processLogin = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    // Inside your validation error check
if (!errors.isEmpty()) {
    // Store each validation error as a separate flash message
    errors.array().forEach(error => {
        req.flash("error", error.msg);
    });
    return res.redirect("/login");
}

    // Extract validated data from the request body
    const { first_name, last_name, email, password_hash, role } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            req.flash("error", "Invalid email or password")
            return res.redirect("/login");
        }

        const passwordVerification = await verifyPassword(password_hash, user.password_hash);

        if (!passwordVerification) {
            req.flash("error", "Invalid email or password")
            return res.redirect("/login");
        }

        // SECURITY: Remove password from user object before storing in session
        const safeUser = { ...user };
        delete safeUser.password;

        req.session.user = safeUser;
        req.flash("success", "Welcome! Thanks for joining us!")
        return res.redirect("/dashboard");

    } catch (error) {
        console.error("Error logging in:", error);
        req.flash("error", "Error logging in. Please try again later.")
        return res.redirect("/login");
    }
};

// Handle logout by destroying the session
const processLogout = (req, res) => {
    // First, check if there is a session object on the request
    if (!req.session) {
        return res.redirect("/");
    }

    // Call destroy() to remove this session from the store (PostgreSQL in our case)
    req.session.destroy((err) => {
        if (err) {
            // If something goes wrong while removing the session from the database:
            console.error("Error destroying session:", err);
            res.clearCookie("connect.sid");
            return res.redirect("/");
        }

        res.clearCookie("connect.sid");
        res.redirect("/");
    });
};

// Display protected dashboard (requires login)
const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    // Security check! Ensure user and sessionData do not contain password field
    if (user && user.password) {
        console.error("Security error: password found in user object");
        delete user.password;
    }
    if (sessionData.user && sessionData.user.password) {
        console.error("Security error: password found in sessionData.user");
        delete sessionData.user.password;
    }

    res.render("dashboard", {
        title: "Dashboard",
        user,
        sessionData
    })

};

// Routes
router.get("/", showLoginForm);
router.post("/", loginValidation, processLogin);

// Export router as default, and specific functions for root-level routes
export default router;
export { processLogout, showDashboard };