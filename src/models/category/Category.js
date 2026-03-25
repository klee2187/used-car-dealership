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

}

// Function to add a new category
export const addCategory = async (name, description) => {
    try {
        const slug = name.toLowerCase().replace(/\s+/g, '-'); // Simple slug generation
        const result = await db.query(`
            INSERT INTO categories (name, description, slug)
            VALUES ($1, $2, $3) RETURNING *
        `, [name, description, slug]);
        return result.rows[0];
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
}

// Function to update an existing category
export const updateCategory = async (id, name, description) => {
    try {
        const slug = name.toLowerCase().replace(/\s+/g, '-'); // Update slug if name changes
        const result = await db.query(`
            UPDATE categories
            SET name = $1, description = $2, slug = $3
            WHERE id = $4 RETURNING *
        `, [name, description, slug, id]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

// Function to delete a category by ID
export const deleteCategory = async (id) => {
    try {
        const result = await db.query(`
            DELETE FROM categories
            WHERE id = $1 RETURNING *
        `, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}  

// Wrapper function to get category by slug
export const getCategoryBySlug = async (slug) => 
    getCategoryByIdentifier(slug, 'slug');