import { body, validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import bcrypt from 'bcrypt';
import { Router } from 'express';

const router = Router();

// Validation rules for login form
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max:255 })
        .withMessage('Email address is too long'),
    body('password')
        .notEmpty()
        .withMessage('Password is require')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128')
];

// Display the login form page
const showLoginForm = (req, res) => {

    res.render('forms/login/form', { 
        title : 'User Login'})
};

// Handle login form submission with validation
const processLogin = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    // Inside your validation error check
if (!errors.isEmpty()) {
    // Store each validation error as a separate flash message
    errors.array().forEach(error => {
        req.flash('error', error.msg);
    });
    return res.redirect('/login');
}

    // Extract validated data from the request body
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            req.flash('error', 'Invalid email or password')
            return res.redirect('/login');
        }

        const passwordVerification = await verifyPassword(password, user.password);

        if (!passwordVerification) {
            req.flash('error', 'Invalid email or password')
            return res.redirect('/login');
        }

        // SECURITY: Remove password from user object before storing in session
        const safeUser = { ...user };
        delete safeUser.password;

        req.session.user = safeUser;
        req.flash('success', 'Welcome! Thanks for joining us!')
        return res.redirect('/dashboard');

    } catch (error) {
        console.error('Error logging in:', error);
        req.flash('error', 'Error logging in. Please try again later.')
        return res.redirect('/login');
    }
};

// Handle logout by destroying the session
const processLogout = (req, res) => {
    // First, check if there is a session object on the request
    if (!req.session) {
        // If no session exists, there's nothing to destroy,
        // so we just redirect the user back to the home page
        return res.redirect('/');
    }

    // Call destroy() to remove this session from the store (PostgreSQL in our case)
    req.session.destroy((err) => {
        if (err) {
            // If something goes wrong while removing the session from the database:
            console.error('Error destroying session:', err);

            // Attempt to clear the session cookie from the browser anyway, even if session destruction failed
            res.clearCookie('connect.sid');

            // Redirect the user to the home page regardless of the error, since we can't do much about it at this point
            return res.redirect('/');
        }

        // If session destruction succeeded, clear the session cookie from the browser
        res.clearCookie('connect.sid');

        // Redirect the user to the home page
        res.redirect('/');
    });
};

// Display protected dashboard (requires login)
const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    // Security check! Ensure user and sessionData do not contain password field
    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }
    if (sessionData.user && sessionData.user.password) {
        console.error('Security error: password found in sessionData.user');
        delete sessionData.user.password;
    }

    res.render('dashboard', {
        title: 'Dashboard',
        user,
        sessionData
    })

};

// Routes
router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

// Export router as default, and specific functions for root-level routes
export default router;
export { processLogout, showDashboard };