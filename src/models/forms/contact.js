import db from "../db.js";

// Creat a new contact message
export const newContactMessage = async ({ subject, message, userId = null }) => {

    try{
        const query = await db.query(
            `INSERT INTO contact_messages (subject, message, user_id)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [subject, message, userId]
        );
        const result = query.rows[0];
        return result;

    } catch (error) {
        console.error("Error, could not create contact message:", error);
        throw error;
    }
}

// Get all contact form submissions (for admin view)
export const getAllContactForms = async () => {

    try {
        const query = 
            `SELECT * FROM contact_messages 
            ORDER BY created_at DESC`;

        const data = await db.query(query);

        return data.rows;

    } catch (error) {
        console.error("Error retrieving contact form submissions:", error);
        throw error;
    }
}

// Create response to contact message (admin use)
export const respondToContactMessage = async ({ response, messageId, responded_at }) => {
    try {
        const query = await db.query(
            `UPDATE contact_messages
            SET response = $1, responded_at = $2
            WHERE message_id = $3
            RETURNING *`,
            [response, responded_at, messageId]
        );

        const result = query.rows[0];
        return result;

    } catch (error) {
        console.error("Error, could not respond to contact message:", error);
        throw error;
    }
}