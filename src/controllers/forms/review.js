import { Router } from "express";
import { body, validationResult } from "express-validator";
import { addVehicleReview, getVehicleReviews } from "../../models/forms/review.js";
import { getVehicleBySlug } from "../../models/vehicle/Vehicle";

const router = Router();

// Validation rules for review form
const reviewValidation = [
    body("rating")
        .isInt({ min: 1, max: 5})
        .withMessage("Judge us in stars. Please provide a rating between 1 and 5."),
    body("comment")
        .trim()
        .isLength({ min: 10 })
        .notEmpty()
        .withMessage("Don't be shy! Please provide a comment of at least 10 characters."),
    body("name_option")
        .optional()
        .trim()
        .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
        .withMessage("Name option contains invalid characters. Please use letters, numbers, spaces, and basic punctuation.")
        .isLength({ max: 50 })
        .withMessage("Name option is too long. Please keep it under 50 characters.")
];

// Display the review form page
const showReviewForm = async (req, res) => {
    const { slug } = req.params;
    let vehicle = await getVehicleBySlug(slug);
    let reviews = await getVehicleReviews(vehicle.vehicle_id);
    res.render("/forms/review/form", {
        title: "Leave a Review",
        vehicle,
        reviews
    });
};

// Handle review form submission with validation
export const createReview = async (req, res) => {
    const errors = validationResult(req);
    const { slug } = req.params;

    if (!errors.isEmpty()) {
        req.flash("error", "You've got some fixing to do. Please correct the errors and try again.");
        return res.redirect(`/vehicles/${slug}`);
    }

    try {
        const { rating, comment, name_option } = req.body;

        let reviewer_name = "Anonymous";

        if (req.user) {
            
            if (name_option === "name") {
                reviewer_name = req.user.name;
            } else if (name_option === "username") {
                reviewer_name = req.user.username;
            }
        } else {
            if (name_option && name_option !== "anonymous") {
                reviewer_name = name_option;
            }
        }

        await addVehicleReview({
            userId: req.user ? req.user.user_id : null,
            vehicleId: vehicle.vehicle_id,
            rating,
            comment,
            reviewer_name
        });

        req.flash("success", "Thank you for sharing your feelings with us. Feel better now?");
        res.redirect(`/vehicles/${slug}`);

    } catch (error) {
        console.error("Error creating review:", error);
        req.flash("error", "Oops! Something went wrong. I guess you'll have to come back later.");
        return res.redirect(`/vehicles/${slug}`);
    }
}

router.get("/:slug", showReviewForm);
router.post("/:slug", reviewValidation, createReview);

export default router;
