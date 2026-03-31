import db from "../../models/db.js";

// Get all vehicles
export const getAllVehicles = async () => {
    try {
        const result = await db.query(`
            SELECT 
                vehicle_id,
                category_id 
                make, 
                model,
                year,
                slug,
                price,
                mileage,
                description, 
                is_available,
                created_at
            FROM vehicles
            ORDER BY created_at DESC
        `);

        return result.rows;
    } catch (error) {
        console.error("Error, could not get all vehicles:", error);
        throw error;
    }
}

// Get a vehicle by slug
export const getVehicleBySlug = async (slug) => {
    try {
        const result = await db.query(`
            SELECT 
                vehicle_id,
                category_id, 
                make, 
                model,
                year,
                slug,
                price,
                mileage,
                description, 
                is_available,
                created_at
            FROM vehicles
            WHERE slug = $1
        `, [slug]);
            
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error, Could not get vehicle by slug:", error);
        throw error;
    }
}

// Get a single vehicle by id   
export const getVehiclesByCategoryId = async (categoryId) => {
    try {
        const result = await db.query(`
            SELECT 
                vehicle_id,
                category_id,
                make, 
                model,
                year,
                slug,
                price,
                mileage,
                description, 
                is_available,
                created_at
            FROM vehicles
            WHERE category_id = $1
            ORDER BY year DESC
        `, [categoryId]);  

        return result.rows || []; 
    } catch (error) {
        console.error("Error, could not get vehicles by category:", error);
        throw error;
    }

}

// Get a single vehicle by id   
export const getVehicleById = async (id) => {
    try {
        const result = await db.query(`
            SELECT 
                vehicle_id,
                category_id, 
                make, 
                model,
                year,
                slug,
                price,
                mileage,
                description, 
                is_available,
                created_at
            FROM vehicles
            WHERE vehicle_id = $1
        `, [id]);  

        return result.rows[0] || null; 
    } catch (error) {
        console.error("Error, could not get vehicle by ID:", error);
        throw error;
    }
}
