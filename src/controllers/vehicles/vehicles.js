// Imports
import { getAllVehicles, getVehicleBySlug } from "../../models/vehicle/Vehicle.js";
import { getCategoryById } from "../../models/category/Category.js";
import { getVehicleReviews } from "../../models/forms/review.js";


// Show all vehicles
export const showAllVehicles = async (req, res) => {
    try {
        const vehicles = await getAllVehicles();

        res.render("vehicles/inventory", {
            title: "All Vehicles",
            vehicles,
            category: null,
            success: req.flash("success"),
            error: req.flash("error")
        });

    } catch (error) {
        console.error("Error loading vehicles page:", error);
        res.status(500).send("Server Error");
    }
} 

// Show one single vehicle detail page by slug
export const showVehicleBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const vehicle = await getVehicleBySlug(slug);
        if (!vehicle) {
            req.flash("error", "Vehicle not found");
            return res.redirect("/vehicles");
        }

        const category = await getCategoryById(vehicle.category_id);
        const reviews = await getVehicleReviews(vehicle.vehicle_id);
        res.render("vehicles/detail", {
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            vehicle,
            category,
            reviews,
            user: req.session.user,
            success: req.flash("success"),
            error: req.flash("error")
        });

    } catch (error) {
        console.error("Error loading vehicle detail page:", error);
        req.flash("error", "An error occurred while loading the vehicle details. Please try again later.");
        res.redirect("/vehicles");
    }
}

