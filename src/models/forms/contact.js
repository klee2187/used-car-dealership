import db from "./db.js";

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