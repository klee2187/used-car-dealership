import { getVehicleReviews, deleteReviewById } from "../../models/forms/review.js";

// Show all reviews for admin management
export const showAllReviews = async (req, res) => {
    try {
        const reviews = await getVehicleReviews(null); // Get all reviews without filtering by vehicle

        res.render("admin/manageReviews", {
            title: "Manage Reviews",
            reviews,
            user: req.session.user,
            success: req.flash("success"),
            error: req.flash("error")
        });
    } catch (error) {
        console.error("Error, could not load reviews for admin management:", error);
        req.flash("error", "Could not load reviews. Please try again later.");
        res.redirect("/admin");
    }
};

// Delete a review (admin only)
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await deleteReviewById(id);

        if (deletedReview) {
            req.flash("success", "Review deleted successfully.");
        } else {
            req.flash("error", "Review not found.");
        }
        res.redirect("/admin/manageReviews");
    } catch (error) {
        console.error("Error, could not delete review:", error);
        req.flash("error", "Could not delete review. Please try again later.");
        res.redirect("/admin/manageReviews");
    }
};