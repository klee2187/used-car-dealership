// Imports
import { getAllCategories, getCategoryBySlug } from "../../models/category/Category.js";
import { getVehiclesByCategoryId } from "../../models/vehicle/Vehicle.js";

// Show all categories
export const showCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render("categories/index", {
            title: "Vehicle Categories",
            categories,
        });
        } catch (error){
        console.error("Error loading categories page:", error);
        res.status(500).send("Server Error");
        }
    }

// Show one single category page by slug
export const showCategoryBySlug = async (req,res) => {
    try {
        const { slug } = req.params;
        const category = await getCategoryBySlug(slug);
        if (!category) {
            return res.status(404).render("404", { message: "Category not found"});
        }

        const vehicles = await getVehiclesByCategoryId(category.category_id);
        res.render("categories/detail", {
            title: category.name,
            category,
            vehicles,
        });

    } catch (error) {
        console.error("Error loading category page:", error);
        res.status(500).send("Server Error");
    }
}