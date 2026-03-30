import db from "../models/db.js";

// This file contains a function to clean up expired sessions from the database. It runs automatically on server startup and then every 12 hours thereafter.
const cleanupExpiredSessions = async () => {
    try {
        const result = await db.query(
            `DELETE FROM session WHERE expire < NOW()`
        );

        if (result.rowCount > 0) {
            console.log(`Cleaned up ${result.rowCount} expired sessions`);
        }
    } catch (error) {
        // Check if the error is due to the session table not existing (PostgreSQL error code 42P01)
        if (error.code === "42P01") {
            console.log("Session table does not exist yet:\n→ It will be created when the first session is initialized.");
            return;
        }

        // Log actual errors
        console.error("Error cleaning up sessions:", error);
    }
};

// Function to start the session cleanup process
const startSessionCleanup = () => {
    // Run cleanup immediately on startup (catches sessions that expired while offline)
    cleanupExpiredSessions();

    // Schedule cleanup to run every 12 hours
    const twelveHours = 12 * 60 * 60 * 1000;
    setInterval(cleanupExpiredSessions, twelveHours);

    console.log("Session cleanup scheduled to run every 12 hours");
};

export { startSessionCleanup };