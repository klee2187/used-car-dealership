// Admin only middleware
export const isAdmin = (req, res, next) => {
    
    try {
        // Check if user is logged in and has admin role
        if (req.session?.user?.role === "admin") {
            return next(); 
        }
        req.flash("error", "You do not have permission to access this page. Administrators only.");
        return res.redirect("/");

    } catch (error) {
        console.error("Error in admin middleware:", error);
        req.flash("error", "An error occurred. Please try again later.");
        return res.redirect("/");
    }
};

//Employee or admin
export const isEmployee = (req, res, next) => {
    
    try {
        const role = req.session?.user?.role;
        if (role === "admin" || role === "employee") {
            return next(); 
        }
        req.flash("error", "You do not have permission to access this page. Employees or administrators only.");
        return res.redirect("/");

    } catch (error) {
        console.error("Error in employee middleware:", error);
        req.flash("error", "An error occurred. Please try again later.");
        return res.redirect("/");
    }
};

