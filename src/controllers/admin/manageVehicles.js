import { getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } from "../../models/vehicle/Vehicle.js";
import { getAllCategories } from "../../models/category/Category.js";

// Show manage vehicles page
export const showManageVehicles = async (req, res) => {
    try {
        const vehicles = await getAllVehicles();
        res.render("admin/vehicles/manageVehicles", { 
            title: "Manage All Vehicles", 
            vehicles,
            success: req.flash("success"),
            error: req.flash("error"),
            user: req.session.user 
        });

    } catch (error) {
        console.error("Error, could not get all vehicles:", error);
        req.flash("error", "Could not load vehicles. Please try again later.");
        res.redirect("/admin/dashboard");
    }
};

// Show add vehicle form
export const showAddVehicleForm = async (req, res) => {
    try {

        const categories = await getAllCategories();

        res.render("admin/vehicles/new", {
            title: "Add New Vehicle",
            categories,
            success: req.flash("success"),
            error: req.flash("error"),
            user: req.session.user
        });

    } catch (error) {
        console.error("Error loading add vehicle form:", error);
        req.flash("error", "Could not load form. Please try again later.");
        res.redirect("/admin/vehicles/manage-vehicles");
    }
};

// Show edit vehicle form
export const showEditVehicleForm = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await getVehicleById(id);   
        if (!vehicle) {
            req.flash("error", "Vehicle not found");
            return res.redirect("/admin/vehicles/manage-vehicles");
        }
        res.render("admin/vehicles/edit", {
            title: "Edit Vehicle",
            vehicle,
            success: req.flash("success"),
            error: req.flash("error"),
            user: req.session.user
        });

    } catch (error) {
        console.error("Error loading edit vehicle form:", error);
        req.flash("error", "Could not load form. Please try again later.");
        res.redirect("/admin/vehicles/manage-vehicles");
    }
};

// Handle create, update, delete vehicle actions
export const createVehiclePage = async (req, res) => {
    try {
        await createVehicle(req.body);

        req.flash("success", "Vehicle created successfully!");
        res.redirect("/admin/vehicles/manage-vehicles");

    } catch (error) {
        console.error("Error creating vehicle:", error);
        req.flash("error", "Could not create vehicle. Please try again later.");
        res.redirect("/admin/vehicles/manage-vehicles");

    }
};

// Handle update vehicle action
export const updateVehiclePage = async (req, res) => {
    try {
        const { id } = req.params;
        await updateVehicle({ 
            vehicleId: id, 
            ...req.body 
        });

        req.flash("success", "Vehicle updated successfully!");
        res.redirect("/admin/vehicles/manage-vehicles");

    } catch (error) {
        console.error("Error updating vehicle:", error);
        req.flash("error", "Could not update vehicle. Please try again later.");
        res.redirect("/admin/vehicles/manage-vehicles");
    }
};
// Handle delete vehicle action
export const deleteVehiclePage = async (req, res) => {

    try {
        const { id } = req.params;  
        await deleteVehicle(id);
        req.flash("success", "Vehicle deleted successfully!");
        res.redirect("/admin/vehicles/manage-vehicles");
    
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        req.flash("error", "Could not delete vehicle. Please try again later.");
        res.redirect("/admin/vehicles/manage-vehicles");
    }
};