import db from '../../models/db.js';

// Function to get all categories
export const getAllCategories = async () => {
    try {
        const result = await db.query(`
            SELECT c.id, c.name, c.slug, COUNT(v.id) AS vehicle_count
            FROM categories c
            LEFT JOIN vehicles v ON c.id = v.category_id
            GROUP BY c.id
            ORDER BY c.name
        `);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}


// Function to get a single category by identifier (id or slug)    
export const getCategoryByIdentifier = async (identifier, identifierType = 'slug') => {
    try {
        const whereClause = identifierType === 'id' ? 'c.id = $1' : 'c.name = $1';
        const query = `
            SELECT c.id, c.name, c.slug, COUNT(v.id) AS vehicle_count
            FROM categories c
            LEFT JOIN vehicles v ON c.id = v.category_id
            WHERE ${whereClause}
            GROUP BY c.id
        `;  

        const result = await db.query(query, [identifier]);
        return result.rows[0]; // Return the first (and should be only) category that matches   
    } catch (error) {
        console.error('Error fetching category by identifier:', error);
        throw error;
    }

    //Wrapper function to get category by id
export const getCategoryById = async (id) => 
    getCategoryByIdentifier(id, 'slug', 'id'); 