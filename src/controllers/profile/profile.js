import { getUserById, updateUser as updateUserModel } from "../../models/user/User.js";

// Show user profile page
export const showProfile = async (req, res) => {

    try {
        if (!req.session.user) {
            req.flash("error", "You must be logged in to view your profile");
            return res.redirect("/login");
        }

        const user = await getUserById({ user_id: req.session.user.user_id });

        res.render("profile/profile", {
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

// Handle profile updates for logged-in users
export const updateProfile = async (req, res) => {
    try {
        if (!req.session.user) {
            req.flash("error", "You must be logged in to update your profile");
            return res.redirect("/login");
        }

        const { first_name, last_name, email } = req.body;
        const currentUser = await getUserById({ user_id: req.session.user.user_id });

        if (!currentUser) {
            req.flash("error", "User not found");
            return res.redirect("/profile");
        }

        const updatedUser = await updateUserModel({
            userId: req.session.user.user_id,
            first_name,
            last_name,
            email,
            username: currentUser.username,
            role: currentUser.role
        });

        req.session.user = {
            ...req.session.user,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            username: updatedUser.username,
            role: updatedUser.role
        };

        req.flash("success", "Profile updated successfully");
        return res.redirect("/profile");
    } catch (error) {
        console.error("Error, could not update profile:", error);
        req.flash("error", "Could not update profile. Please try again later.");
        return res.redirect("/profile");
    }
};