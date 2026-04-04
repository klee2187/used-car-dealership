import { Router } from "express";
import { body, validationResult } from "express-validator";
import { addVehicleReview, getVehicleReviews } from "../../models/forms/review.js";
import { getVehicleBySlug } from "../../models/vehicle/Vehicle.js";

const router = Router();

// Validation rules for review form
export const reviewValidation = [
    body("rating")
        .isInt({ min: 1, max: 5})
        .withMessage("Judge us in stars. Please provide a rating between 1 and 5."),
    body("comment")
        .trim()
        .isLength({ min: 10 })
        .notEmpty()
        .withMessage("Don't be shy! Please provide a comment of at least 10 characters."),
];

// Display the review form page
export const showReviewForm = async (req, res) => {
    const { slug } = req.params;
    
    let vehicle = await getVehicleBySlug(slug);
    let reviews = await getVehicleReviews(vehicle.vehicle_id);

    res.render("forms/reviews/form", {
        title: "Leave a Review",
        pageStyles: "reviews",
        vehicle,
        reviews,
        user: req.session.user || null
    });
};

// Handle review form submission with validation
export const createReview = async (req, res) => {
    const errors = validationResult(req);
    const { slug } = req.params;

        let vehicle = await getVehicleBySlug(slug);

    if (!errors.isEmpty()) {
        req.flash("error", "You've got some fixing to do. Please correct the errors and try again.");
        return res.redirect(`/vehicles/${slug}`);
    }

    try {
        const { rating, comment, name_option } = req.body;

        let reviewer_name = "Anonymous";

        if (req.session.user) {
            if (name_option === "full") {
                reviewer_name = `${req.session.user.first_name} ${req.session.user.last_name}`;
            } else if (name_option === "first") {
                reviewer_name = req.session.user.first_name;
            }
        }

        await addVehicleReview({
            userId: req.session.user ? req.session.user.user_id : null,
            vehicleId: vehicle.vehicle_id,
            rating,
            comment,
            reviewer_name
        });

        req.flash("success", "Thank you for sharing your feelings with us. Feel better now?");
        res.redirect(`/vehicles/${slug}`);

    } catch (error) {
        console.error("Error saving review:", error);
        req.flash("error", "Oops! Something went wrong. I guess you'll have to come back later.");
        return res.redirect(`/vehicles/${slug}`);
    }
}

router.get("/:slug", showReviewForm);
router.post("/:slug", reviewValidation, createReview);

export default router;