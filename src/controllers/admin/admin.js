import { getAllUsers } from "../../models/user/User.js";

// GET all users (admin)
export const showAllUsers = async (req, res) => {

    try {
        const users = await getAllUsers();
        res.render("admin/manageUser", { 
            title: "Manage All Users", 
            users,
            success: req.flash("success"),
            error: req.flash("error") 
        });

    } catch (error) {
        console.error("Error, could not get all users:", error);
        req.flash("error", "Could not load users. Please try again later.");
        res.redirect("/admin/dashboard");
    }
};

// Show Admin dashboard
export const showAdminDashboard = (req, res) => {

    try {
        res.render("admin/dashboard", { 
            title: "Admin Dashboard",
            user: req.session.user,
            success: req.flash("success"),
            error: req.flash("error") 
        });

    } catch (error) {
        console.error("Error, could not load admin dashboard:", error);
        req.flash("error", "Could not load admin dashboard. Please try again later.");
        return res.redirect("/");
    };
};

