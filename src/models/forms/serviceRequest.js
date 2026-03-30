import db from "./db.js";

// Create a new service request
export const newServiceRequest = async ({ userId, vehicleId, status, description, created_at }) => {
    try {
        const result = await db.query(
            `INSERT INTO service_requests (user_id, vehicle_id, status, description, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [userId, vehicleId, status, description, created_at]
        );
        return result.rows[0];

    } catch (error) {
        console.error("Error, could not create service request:", error);
        throw error;    
    }
}

// Update service request status and internal notes (for admin use)
export const updateServiceRequest = async ({ status, internalNotes, requestId, updated_at }) => {
    try {
        const result = await db.query(
            `UPDATE service_requests
            SET status = $1, internal_notes = $2, updated_at = $4
            WHERE request_id = $3
            RETURNING *`,
            [status, internalNotes, requestId, updated_at]
        );
        return result.rows[0];

    } catch (error) {
        console.error("Error, could not update service request:", error);
        throw error;    
    }
}

// Get all service requests for a user
export const getUserServiceRequests = async (userId) => {
    try {
        const result = await db.query(
            `SELECT sr.*, v.make, v.model, v.year
            FROM service_requests sr
            LEFT JOIN vehicles v ON sr.vehicle_id = v.vehicle_id
            WHERE sr.user_id = $1
            ORDER BY sr.created_at DESC`,
            [userId]
        );
        return result.rows;

    } catch (error) {
        console.error("Error, could not get service requests for user:", error);
        throw error;    
     }
}
