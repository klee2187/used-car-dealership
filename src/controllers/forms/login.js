import { body, validationResult } from "express-validator";
import { getUserByEmail } from "../../models/user/User.js";
import bcrypt from "bcrypt";

//GET /login
export const showLoginForm = (req, res) => {
    res.render("forms/auth/login", {
        title: "Sign in Here"
    });
};

// POST /login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await getUserByEmail(email);

        if (!user) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/login");
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/login");
        }

        // Save user to session
        req.session.user = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            username: user.username,
            role: user.role
        };

        req.flash("success", `Login successful. Welcome back, ${user.first_name}`);
        res.redirect("/");

    } catch (error) {
        console.error("Login error:", error);
        req.flash("error", "Login failed. Please try again later.");
        res.redirect("/login");
    }
}

//GET /logout
export const logoutUser = (req, res) => {
        req.flash("success", "You have been logged out successfully.");

    req.session.destroy((err) => {
        
        if (err) {
            console.error("Logout error:", err);
            return res.redirect("/dashboard");
        }
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
}



// Validation rules for login form
export const loginValidation = [
    
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
        .isLength({ max:255 })
        .withMessage("Email address is too long"),
    body("password")
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