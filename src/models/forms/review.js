import db from "../db.js";

// Get all reviews for a vehicle, or all reviews if vehicleId is null
export const getVehicleReviews = async (vehicleId) => {
    try {
        const query = vehicleId
            ? await db.query(
                `SELECT r.review_id, u.username, u.first_name, u.last_name, r.rating, r.comment, r.created_at,
                    u.user_id, v.make, v.model, v.year
                FROM reviews r
                JOIN users u ON r.user_id = u.user_id
                JOIN vehicles v ON r.vehicle_id = v.vehicle_id
                WHERE r.vehicle_id = $1
                ORDER BY r.created_at DESC`,
                [vehicleId]
            )
            : await db.query(
                `SELECT r.review_id, u.username, u.first_name, u.last_name, r.rating, r.comment, r.created_at,
                    u.user_id, v.make, v.model, v.year
                FROM reviews r
                JOIN users u ON r.user_id = u.user_id
                JOIN vehicles v ON r.vehicle_id = v.vehicle_id
                ORDER BY r.created_at DESC`
            );

        const result = query.rows;
        return result;

    } catch (error) {
        console.error("Error, could not get reviews for vehicle:", error);
        throw error;
    }
}

// Add a review for a vehicle
export const addVehicleReview = async ({ userId, vehicleId, rating, comment }) => {
    try {
        const query = await db.query(
            `INSERT INTO reviews (user_id, vehicle_id, rating, comment)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [userId, vehicleId, rating, comment]
        );
        const result = query.rows[0];
        return result;

    } catch (error) {
        console.error("Error, could not add review for vehicle:", error);
        throw error;
    }
}

// Delete a review (admin only)
export const deleteReviewById = async (reviewId) => {
    try {
        const query = await db.query(
            `DELETE FROM reviews
            WHERE review_id = $1
            RETURNING *`,
            [reviewId]
        );

        const result = query.rows[0];
        return result;

    } catch (error) {
        console.error("Error, could not delete review:", error);
        throw error;
    }
};