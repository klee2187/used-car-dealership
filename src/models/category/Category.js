import db from "../../models/db.js";

// Get all categories
export const getAllCategories = async () => {
    try {
        const result = await db.query(`
            SELECT 
                c.category_id, 
                c.name, 
                c.slug,
                c.description, 
                COUNT(v.vehicle_id) AS vehicle_count
            FROM categories c
            LEFT JOIN vehicles v ON c.category_id = v.category_id
            GROUP BY c.category_id
            ORDER BY c.name ASC
        `);
        return result.rows;
    } catch (error) {
        console.error("Error, could not get all categories:", error);
        throw error;
    }
}

// Get a category by slug
export const getCategoryBySlug = async (slug) => {
    try {
        const result = await db.query(`
            SELECT
                c.category_id,
                c.name,
                c.slug,
                c.description,
                COUNT(v.vehicle_id) AS vehicle_count
            FROM categories c
            LEFT JOIN vehicles v ON c.category_id = v.category_id
            WHERE c.slug = $1
            GROUP BY c.category_id
            `, [slug]);
            
            return result.rows[0] || null;
    } catch (error) {
        console.error("Error, Could not get category by slug:", error);
        throw error;
    }
}

// Get a single category by id   
export const getCategoryById = async (id) => {
    try {
        const result = await db.query( `
            SELECT 
                c.category_id, 
                c.name, 
                c.slug,
                c.description,
                COUNT(v.vehicle_id) AS vehicle_count
            FROM categories c
            LEFT JOIN vehicles v ON c.category_id = v.category_id
            WHERE c.category_id = $1
            GROUP BY c.category_id
            `, [id]);  

        return result.rows[0] || null; 
    } catch (error) {
        console.error("Error, could not get category by ID:", error);
        throw error;
    }
}
