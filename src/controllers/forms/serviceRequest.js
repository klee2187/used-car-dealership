import { Router } from "express";
import { body, validationResult } from "express-validator";
import { newServiceRequest } from "../../models/forms/serviceRequest.js";
import { getVehicleBySlug } from "../../models/vehicle/Vehicle.js";

export const router = Router();

// Validation rules for service request form
export const serviceRequestValidation = [
    body("description")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters"),
];

// Handle service request form submission
export const showServiceRequestForm = async (req, res) => {
    try {
        const { slug } = req.params;
        const vehicle = await getVehicleBySlug(slug);
        if (!vehicle) {
            req.flash("error", "Vehicle not found");
            return res.redirect("/vehicles");
        }
        res.render("forms/serviceRequest/form", {
            title: "Service Request",
            pageStyles: "forms",
            user: req.session.user || null,
            vehicle
        });
    } catch (error) {
        console.error("Error loading service request form:", error);
        req.flash("error", "Could not load service request form.");
        res.redirect("/vehicles");
    }
};

// 
export const processServiceRequest = async (req, res) => {
    try {
        const errors = validationResult(req);
        const { slug } = req.params;

        if (!errors.isEmpty()) {
            errors.array().forEach(error => 
                req.flash("error", error.msg)
            );
            return res.redirect(`/serviceRequest/form/${slug}`);
        }

        const vehicle = await getVehicleBySlug(slug);
        if (!vehicle) {
            req.flash("error", "Vehicle not found");
            return res.redirect("/vehicles");
        }
        
        if (!req.session?.user) {
            req.flash("error", "You must be logged in to submit a service request.");
            return res.redirect("/login");
        }

        const userId = req.session.user.user_id;

        await newServiceRequest({
            userId, 
            vehicleId: vehicle.vehicle_id, 
            description: req.body.description,
            status: "submitted",
            created_at: new Date()
        });

        req.flash("success", "Your service request has been submitted. We will contact you soon.");
        res.redirect(`/`);
    } catch (error) {
        console.error("Error processing service request:", error);
        const { slug } = req.params;
        req.flash("error", "Could not submit service request. Please try again.");
        res.redirect(`/serviceRequest/form/${slug}`);
    }
};

// Routes
router.get("/form/:slug", showServiceRequestForm);
router.post("/form/:slug", serviceRequestValidation, processServiceRequest);

export default router;
