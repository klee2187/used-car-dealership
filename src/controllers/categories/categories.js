// Imports
import { getCategoryBySlug } from "../../models/category/Category.js";
import { getVehiclesByCategoryId } from "../../models/vehicle/Vehicle.js";

// Redirect /categories to /vehicles
export const showCategories = async (req, res) => {
   return res.redirect("/vehicles");
}


// Show one single category by slug
export const showCategoryBySlug = async (req,res) => {
    try {
        const { slug } = req.params;
        const category = await getCategoryBySlug(slug);
        if (!category) {
            req.flash("error", "Category not found");
            return res.redirect("/vehicles"); 
        }

        const vehicles = await getVehiclesByCategoryId(category.category_id);

        res.render("vehicles/inventory", {
            title: category.name,
            category,
            vehicles,
            success: req.flash("success"),
            error: req.flash("error")
        });

    } catch (error) {
        console.error("Error loading category page:", error);
        req.flash("error", "Sorry, something went wrong while loading that category. Please try again later.");
        res.redirect("/vehicles");
    }
}