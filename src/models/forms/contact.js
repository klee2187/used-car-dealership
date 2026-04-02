import db from "../db.js";

// Creat a new contact message
export const newContactMessage = async ({ subject, message, userId = null }) => {
    try{
        const result = await db.query(
            `INSERT INTO contact_messages (subject, message, user_id)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [subject, message, userId]
        );

        return result.rows[0];

    } catch (error) {
        console.error("Error, could not create contact message:", error);
        throw error;
    }
}

// Get all contact form submissions (for admin view)
export const getAllContactForms = async () => {
    try {
        const sql = `SELECT * FROM contact_messages ORDER BY created_at DESC`;
        const data = await db.query(sql);

        return data.rows;

    } catch (error) {
        console.error("Error retrieving contact form submissions:", error);
        throw error;
    }
}