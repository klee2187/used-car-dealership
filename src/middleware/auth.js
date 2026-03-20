// Middleware to check if user is logged in before allowing access to certain routes
const requireLogin = (req, res, next) => {
    // Check if user is logged in via session
    if (req.session && req.session.user) {
        // User is authenticated - set UI state and continue
        res.locals.isLoggedIn = true;
        next();
    } else {
        // User is not authenticated - redirect to login
        req.flash('error', 'You are not authorized to access that information without proper login credentials')
        res.redirect('/login');
    }
};

export { requireLogin };