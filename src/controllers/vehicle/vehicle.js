// Imports
import { getAllVehicles, getVehicleBySlug } from '../../models/vehicle/Vehicle.js';
import { getCategoryById } from '../../models/category/Category.js';


// Show all vehicles
export const showAllVehicles = async (requestAnimationFrame, res) => {
    try {
        const vehicles = await getAllVehicles();
        res.render("vehicles/index", {
            title: "All Vehicles",
            vehicles
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
            return res.status(404).render("404", { message: "Vehicle not found"});
        }

        const category = await getCategoryById(vehicle.category_id);
        res.render("vehicles/detail", {
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            vehicle,
            category
        });
    } catch (error) {
        console.error("Error loading vehicle detail page:", error);
        res.status(500).send("Server Error");
    }
}