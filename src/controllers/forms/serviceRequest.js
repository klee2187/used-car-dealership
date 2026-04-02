import { Router } from "express";
import { body, validationResult } from "express-validator";
import { createServiceRequest } from "../../models/forms/serviceRequest.js";
import { getVehicleBySlug } from "../../models/vehicle/Vehicle";

export const router = Router();

// Validation rules for service request form
export const serviceRequestValidation = [
    body("description")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters"),
];

export const showServiceRequestForm = async (req, res) => {
    const { slug } = req.params;
    let vehicle = await getVehicleBySlug(slug);

    res.render("/forms/service/form", {
        title: "Service Request",
        vehicle
    });
};

export const processServiceRequest = async (req, res) => {
    const errors = validationResult(req);
    const { slug } = req.params;

    if (!errors.isEmpty()) {
        errors.array().forEach(error => 
            req.flash("error", error.msg)
        );
        return res.redirect(`/service-request/${slug}`);
    }

    const vehicle = await getVehicleBySlug(slug);
    const userId = await res.redirect("/login");

    await createServiceRequest({
        userId, 
        vehicleId: vehicle.vehicle_id, 
        description: req.body.description
    });

    req.flash("success", "Your service request has been submitted. We will contact you soon.");
    res.redirect(`/dashboard`);

};

// Routes
router.get("/:slug", showServiceRequestForm);
router.post("/:slug", serviceRequestValidation, processServiceRequest);

export default router;
