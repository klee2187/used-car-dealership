import bcrypt from "bcrypt";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser as updateUserModel,
    deleteUser as deleteUserModel
} from "../../models/user/User.js";



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

