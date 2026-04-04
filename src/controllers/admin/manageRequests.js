import { getAllServiceRequests, updateServiceRequest } from "../../models/forms/serviceRequest.js";

// Show all service requests
export const showAllServiceRequests = async (req, res) => {
    
    try {
        const serviceRequests = await getAllServiceRequests();
        res.render("admin/manageRequests", { 
            title: "Service Requests", 
            serviceRequests,
            user: req.session.user,
            success: req.flash("success"),
            error: req.flash("error") 
        });

    } catch (error) {
        console.error("Error fetching service requests:", error);
        req.flash("error", "Could not load service requests. Please try again later.");
        return res.redirect("/admin/dashboard");
    }
};

// Update service request status
export const updateRequestStatus = async (req, res) => {

    try {
        const { id } = req.params;
        const { status, internal_notes } = req.body;

        await updateServiceRequest({ 
            requestId: id, 
            status, 
            internalNotes: internal_notes, 
            updated_at: new Date() });

        req.flash("success", "Service request status updated successfully.");
        return res.redirect("/admin/requests");
    
    } catch (error) {
        console.error("Error updating service request status:", error);
        req.flash("error", "Could not update service request status. Please try again later.");
        return res.redirect("/admin/requests");
    }
};