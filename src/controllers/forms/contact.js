import { Router } from "express";
import { body } from "express-validator";
import { newContactMessage, getAllContactForms } from "../../models/forms/contact.js";
import { requireLogin } from "../../middleware/auth.js";
import { isAdmin } from "../../middleware/role.js";

const router = Router();

// Display the contact form page
export const showContactForm = (req, res) => {
    try {
        res.render("forms/contact/form", {
            title: "Contact Us"
        });
    } catch (error) {
        console.error("Error rendering contact form:", error);
        req.flash("error", "Unable to load the contact form. Please try again later.");
        res.render("forms/contact/form", {
            title: "Contact Us"
        });
    }
};

// Handle contact form submission with validation
export const handleContactSubmission = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        await newContactMessage({
            name,
            email,
            subject,
            message,
            userId: req.session.user?.user_id || null
        });

        req.flash("success", "Thank you for contacting us! We will respond soon.");
        res.redirect("/contact");

    } catch (error) {
        console.error("Error saving contact message:", error);
        req.flash("error", "Unable to submit your message. Please try again later.");
        res.redirect("/contact");
    }
};

// Admin route to view all contact form submissions
export const showContactMessages = async (req, res) => {
    let contactForms = [];

    try {
        contactForms = await getAllContactForms();
    } catch (error) {
        console.error("Error retrieving contact form submissions:", error);
        req.flash("error", "Unable to retrieve contact form submissions. Please try again later.");
    }

    req.flash("success", "Contact form submissions retrieved successfully.");
    res.render("forms/contact/responses", {
        title: "Contact Form Submissions",
        contactForms
    });
};



// GET /contact
router.get("/", showContactForm);

// POST /contact
router.post("/", handleContactSubmission);

// Admin inbox
router.get("/responses", requireLogin, isAdmin, showContactMessages);

export default router;