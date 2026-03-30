// Imports
import db from "../db.js";

// Get user by email
export const getUserByEmail = async (email) => {
    try {
        const result = await db.query(
            `SELECT user_id, name, email, password, role
            FROM users
            WHERE email = $1`, 
            [email]);
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error, could not get user by email:", error);
        throw error;
    }
}

// Create new user (registration)
export const createUser = async ({ name, email, password, role = "customer"}) => {
    try {
        const result = await db.query(
            `INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id, name, email, role`, 
            [name, email, password, role]);
        return result.rows[0];
    } catch (error) {
        console.error("Error, could not create user:", error);
        throw error;
    }
}

// Get user by id (for sessions)
export const getUserById = async ({ user_id }) => {
    try {
        const result = await db.query(
            `SELECT user_id, name, email, role
            FROM users
            WHERE user_id = $1`, 
            [user_id]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error("Error, could not get user by id:", error);
        throw error;
    }
}

