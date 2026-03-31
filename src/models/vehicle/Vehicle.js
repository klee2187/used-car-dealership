import db from "../../models/db.js";

// Get all vehicles
export const getAllVehicles = async () => {
    try {
        const result = await db.query(`
            SELECT 
                v.vehicle_id,
                v.category_id, 
                v.make, 
                v.model,
                v.year,
                v.slug,
                v.price,
                v.mileage,
                v.description, 
                v.is_available,
                v.created_at,
                vi.image_url
            FROM vehicles v
            LEFT JOIN vehicle_images vi ON v.vehicle_id = vi.vehicle_id
            ORDER BY v.created_at DESC
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
                v.vehicle_id,
                v.category_id, 
                v.make, 
                v.model,
                v.year,
                v.slug,
                v.price,
                v.mileage,
                v.description, 
                v.is_available,
                v.created_at,
                vi.image_url
            FROM vehicles v
            LEFT JOIN vehicle_images vi ON v.vehicle_id = vi.vehicle_id
            WHERE v.slug = $1
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
                v.vehicle_id,
                v.category_id,
                v.make, 
                v.model,
                v.year,
                v.slug,
                v.price,
                v.mileage,
                v.description, 
                v.is_available,
                v.created_at, 
                vi.image_url
            FROM vehicles v
            LEFT JOIN vehicle_images vi ON v.vehicle_id = vi.vehicle_id
            WHERE v.category_id = $1
            ORDER BY v.year DESC
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
                v.vehicle_id,
                v.category_id, 
                v.make, 
                v.model,
                v.year,
                v.slug,
                v.price,
                v.mileage,
                v.description, 
                v.is_available,
                v.created_at,
                vi.image_url
            FROM vehicles v
            LEFT JOIN vehicle_images vi ON v.vehicle_id = vi.vehicle_id
            WHERE v.vehicle_id = $1
        `, [id]);  

        return result.rows[0] || null; 
    } catch (error) {
        console.error("Error, could not get vehicle by ID:", error);
        throw error;
    }
}
