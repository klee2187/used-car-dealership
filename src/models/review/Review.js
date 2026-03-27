import db from "./db.js";

// Get all reviews for a vehicle
export const getVehicleReviews = async (vehicleId) => {
    try {
        const result = await db.query(
            `SELECT r.review_id, r.rating, r.comment, r.created_at,
                u.user_id, u.name
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.vehicle_id = $1
            ORDER BY r.created_at DESC`,
            [vehicleId]
        );
        return result.rows;

    } catch (error) {
        console.error('Error, could not get reviews for vehicle:', error);
        throw error;
    }
}

// Add a review for a vehicle
export const addVehicleReview = async ({ userId, vehicleId, rating, comment }) => {
    try {
        const result = await db.query(
            `INSERT INTO reviews (user_id, vehicle_id, rating, comment)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [userId, vehicleId, rating, comment]
        );
        return result.rows[0];

    } catch (error) {
        console.error('Error, could not add review for vehicle:', error);
        throw error;
    }
}