import bcrypt from 'bcrypt';
import db from '../db.js';

// Find a user by email (for login)
const findUserByEmail = async (email) => {

    const query = `
        SELECT id, name, LOWER(email) AS email, password, created_at
        FROM users
        WHERE LOWER(email) = LOWER($1)
        ORDER BY created_at DESC
        LIMIT 1
    `;
    const result = await db.query(query, [email]);
    return result.rows[0];;

};

// Verify password
const verifyPassword = async (plainPassword, hashedPassword) => {
    const result = await bcrypt.compare(plainPassword, hashedPassword);
    return result;
};

export { findUserByEmail, verifyPassword };