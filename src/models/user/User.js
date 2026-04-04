// Imports
import db from "../db.js";

//Get all users (for admin)
export const getAllUsers = async () => {

    try {
        const query = await db.query(
            `SELECT user_id, first_name, last_name, email, username, role
            FROM users 
            ORDER BY last_name, first_name ASC`
        );
        const result = query.rows;
        return result;

    } catch (error) {
        console.error("Error, could not get all users:", error);
        throw error;
    }
};

// Get user by email
export const getUserByEmail = async (email) => {

    try {
        const query = await db.query(
            `SELECT user_id, first_name, last_name, email, password_hash, role
            FROM users
            WHERE email = $1`, 
            [email]);

        const result = query.rows[0] || null;    
        return result;
    } catch (error) {
        console.error("Error, could not get user by email:", error);
        throw error;
    }
}

// Create new user (registration)
export const createUser = async ({ first_name, last_name, email, username, password_hash, role = "customer"}) => {

    try {
        const query = await db.query(
            `INSERT INTO users (first_name, last_name, email, username, password_hash, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_id, first_name, last_name, email, username, role`, 
            [first_name, last_name, email, username, password_hash, role]);

        const result = query.rows[0];
        return result;

    } catch (error) {
        console.error("Error, could not create user:", error);
        throw error;
    }
}

// Get user by id (for sessions)
export const getUserById = async ({ user_id }) => {

    try {
        const query = await db.query(
            `SELECT user_id, first_name, last_name, email, username, password_hash, role
            FROM users
            WHERE user_id = $1`, 
            [user_id]
        );

        const result = query.rows[0] || null;
        return result;

    } catch (error) {
        console.error("Error, could not get user by id:", error);
        throw error;
    }
}

export const updateUser = async ({ userId, first_name, last_name, email, username, role }) => {
    
    try {
        const query = await db.query(
            `UPDATE users
            SET first_name = $1, last_name = $2, email = $3, username = $4, role = $5
            WHERE user_id = $6
            RETURNING user_id, first_name, last_name, email, username, role`,
            [first_name, last_name, email, username, role, userId]
        );

        const result = query.rows[0];
        return result;
        
    } catch (error) {
        console.error("Error, could not update user:", error);
        throw error;
    }
}

export const deleteUser = async (userId) => {

    try {
        const query = await db.query(
            `DELETE FROM users
            WHERE user_id = $1
            RETURNING user_id, first_name, last_name, email, username, role`,
            [userId]
        );

        const result = query.rows[0];
        return result;
        
    } catch (error) {
        console.error("Error, could not delete user:", error);
        throw error;
    }
};

