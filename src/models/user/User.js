// Imports
import db from "../db.js";

//Get all users (for admin)
export const getAllUsers = async () => {
    try {
        const result = await db.query(
            `SELECT user_id, first_name, last_name, email, username, role
            FROM users 
            ORDER BY last_name, first_name ASC`
        );

        return result.rows;
    } catch (error) {
        console.error("Error, could not get all users:", error);
        throw error;
    }
};

// Get user by email
export const getUserByEmail = async (email) => {
    try {
        const result = await db.query(
            `SELECT user_id, first_name, last_name, email, password_hash, role
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
export const createUser = async ({ first_name, last_name, email, username, password_hash, role = "customer"}) => {
    try {
        const result = await db.query(
            `INSERT INTO users (first_name, last_name, email, username, password_hash, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_id, first_name, last_name, email, username, role`, 
            [first_name, last_name, email, username, password_hash, role]);
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
            `SELECT user_id, first_name, last_name, email, username, password_hash, role
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

