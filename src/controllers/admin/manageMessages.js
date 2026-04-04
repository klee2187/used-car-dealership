import { getAllContactForms } from "../../models/forms/contact.js";

export const showUserMessages = async (req, res) => {
    try {
        const messages = await getAllContactForms();

        res.render("admin/manageMessages", {
            title: "Contact Form Messages",
            messages,
            user: req.session.user,
            success: req.flash("success"),
            error: req.flash("error")
        });
    } catch (error) {
        console.error("Error, could not load user messages:", error);
        req.flash("error", "Could not load user messages. Please try again later.");
        res.redirect("/admin/users/");

    }
}