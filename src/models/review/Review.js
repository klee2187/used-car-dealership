import db from '../../models/db.js';

// Function to get all reviews for a specific vehicle
export const getReviewsByVehicleId = async (vehicleId) => {
    try {
        const orderByClause = sortBy === 'name' ? 'r.reviewer_name' : 'r.created_at';

        const result = await db.query(`
            SELECT r.slug, r.reviewer_name, r.rating, r.comment, r.created_at
            FROM reviews r
            WHERE r.vehicle_id = $1
            ORDER BY ${orderByClause} DESC
        `, [vehicleId]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching reviews for vehicle:', error);
        throw error;
    }  
}

// Function to add a new review for a specific vehicle
export const addReview = async (vehicleId, reviewerName, rating, comment) => {
    try {
        const result = await db.query(` 
            INSERT INTO reviews (vehicle_id, reviewer_name, rating, comment)
            VALUES ($1, $2, $3, $4) RETURNING *
        `, [vehicleId, reviewerName, rating, comment]);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding review for vehicle:', error);
        throw error;
    }
}

// Function to get a single review by its ID or slug
export const getReviewByIdentifier = async (identifier, identifierType = 'slug') => {
    try {
        const whereClause = identifierType === 'id' ? 'r.id = $1' : 'r.slug = $1';
        const query = `
            SELECT r.slug, r.reviewer_name, r.rating, r.comment, r.created_at
            FROM reviews r
            WHERE ${whereClause}
        `;
        const result = await db.query(query, [identifier]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching review by identifier:', error);
        throw error;
    }
}

// Wrapper function to get review by slug
export const getReviewBySlug = async (slug) => 
    getReviewByIdentifier(slug, 'slug');    

