import { getUserById } from "../../models/user/User.js";

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