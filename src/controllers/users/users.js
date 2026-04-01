// Imports
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { getUserByEmail, createUser, getUserById } from "../../models/user/User.js";

// GET /register
export const showRegistrationForm = (req, res) => {
    res.render("forms/auth/register", {
        title: "Sign Up Here"
    });
};

// POST /register
export const registerUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("error", "Please fix the errors in the form and try again");
        return res.redirect("/register");
    }

    try {
        const { first_name, last_name, email, username, password} = req.body;

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            req.flash("error", "Account already exists for this user");
            return res.redirect("/register");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await createUser({ 
            first_name,
            last_name,
            email, 
            username,
            password_hash: hashedPassword,
            role: "customer" 
    });

        req.flash("success", "Account created successfully. Please log in.");
        res.redirect("/login");

    } catch (error) {
        console.error("Registration error:", error);
        req.flash("error", "Something went wrong while creating your account. Please try again later.");
        res.redirect("/register");
    }
}

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
    req.session.destroy((err) => {
        
        if (err) {
            console.error("Logout error:", err);
            req.flash("error", "Logout failed. Please try again later.");
            return res.redirect("/");
        }
        
        res.clearCookie("connect.sid");
        req.flash("success", "You have been logged out successfully.");
        res.redirect("/");
    });
}

// Show user profile page
export const showProfile = async (req, res) => {

    try {
        if (!req.session.user) {
            req.flash("error", "You must be logged in to view your profile");
            return res.redirect("/login");
        }

        const user = await getUserById({ user_id: req.session.user.user_id });

        res.render("users/profile", {
            title: `${user.first_name} ${user.last_name}'s Profile`,
            user,
            serviceRequests: []
        });

    } catch (error) {
        console.error(error);
        req.flash("error", "An error occurred while fetching your profile");
        res.redirect("/");
    }
}