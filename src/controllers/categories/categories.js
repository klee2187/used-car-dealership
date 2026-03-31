// Imports
import { getAllCategories, getCategoryBySlug } from "../../models/category/Category.js";
import { getVehiclesByCategoryId } from "../../models/vehicle/Vehicle.js";

// Show all categories
export const showCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render("categories/index", {
            title: "Browse Categories",
            categories,
            success: req.flash("success"),
            error: req.flash("error")
        });
    } catch (error) {
        console.error("Error loading categories page:", error);
        req.flash("error", "Sorry, something went wrong while loading the categories. Please try again later.");
        res.redirect("/");
    }
}


// Show one single category by slug
export const showCategoryBySlug = async (req,res) => {
    try {
        const { slug } = req.params;
        const category = await getCategoryBySlug(slug);
        if (!category) {
            req.flash("error", "Category not found");
            return res.redirect("/categories"); 
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
        res.redirect("/categories");
    }
}