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

// Get vehicles by category ID   
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

export const createVehicle = async ({ categoryId, make, model, year, slug, price, mileage, description, isAvailable }) => {
    try {
        const result = await db.query(
            `INSERT INTO vehicles (
            category_id, 
            make, 
            model, 
            year, 
            slug, 
            price, 
            mileage, 
            description, 
            is_available)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`, [categoryId, make, model, year, slug, price, mileage, description, isAvailable]
        );

        return result.rows[0];
    } catch (error) {
        console.error("Error, could not create vehicle:", error);
        throw error;
    }
}

export const updateVehicle = async ({ categoryId, make, model, year, slug, price, mileage, description, isAvailable, vehicleId }) => {
    try {
        const result = await db.query( 
            `UPDATE vehicles
            SET category_id = $1, 
                make = $2,
                model = $3,
                year = $4,
                slug = $5,
                price = $6,
                mileage = $7,
                description = $8,
                is_available = $9
            WHERE vehicle_id = $10
            RETURNING *`, [categoryId, make, model, year, slug, price, mileage, description, isAvailable, vehicleId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error, could not update vehicle:", error);
        throw error;
    }  
}

export const deleteVehicle = async (vehicleId) => {
    try {
        const result = await db.query(
            `DELETE FROM vehicles   
            WHERE vehicle_id = $1
            RETURNING *`, [vehicleId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error, could not delete vehicle:", error);
        throw error;
    }
}

// Get all vehicles with optional filters (for admin view)  
export const getFilteredVehicles = async (identifier, identifierType = 'slug', sortBy = 'make') => {
    // Search by vehicle ID or vehicle slug
    const whereClause = identifierType === 'id' ? 'v.vehicle_id = $1' : 'v.slug = $1';
    
    // Different sorting options - by make, model, year, price, mileage, or category name
    const orderByClause = sortBy === 'model' ? 'v.model' : 'v.year' ? 'v.year' :
                          sortBy === 'make' ? 'v.make' : 
                          sortBy === 'year' ? 'v.year' :
                          sortBy === 'price' ? 'v.price' :
                          sortBy === 'mileage' ? 'v.mileage' :
                          sortBy === 'category' ? 'c.name' : 'v.make'; // Default sort by make
    
    // Build the query with dynamic WHERE and ORDER BY clauses
    const query = `
        SELECT v.vehicle_id, v.category_id, v.make, v.model, v.year, v.slug, v.price, v.mileage, v.description, v.is_available,
            c.name as category_name
        FROM vehicles v
        JOIN categories c ON v.category_id = c.id
        WHERE ${whereClause}
        ORDER BY ${orderByClause}
    `;
    
    const result = await db.query(query, [identifier]);
    
    return result.rows.map(section => ({
        id: section.vehicle_id,
        categoryId: section.category_id,
        make: section.make,
        model: section.model,
        year: section.year,
        slug: section.slug,
        price: section.price,
        mileage: section.mileage,
        description: section.description,
        isAvailable: section.is_available,
        categoryName: section.category_name
    }));
};