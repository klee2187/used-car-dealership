import db from './db.js';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// This file contains functions to set up the database, including seeding initial data and testing the connection.
const setupDatabase = async () => {
    
    let hasData = false;
    try {
        const result = await db.query(
            "SELECT EXISTS (SELECT 1 FROM vehicles LIMIT 1) as has_data"
        );
        hasData = result.rows[0]?.has_data || false;
    } catch (error) {
        
        // If the error is due to the vehicles table not existing, we can ignore it and proceed to seed the database
        hasData = false;
    }
    
    if (hasData) {
        console.log('Database already seeded');
    } else {
        
        console.log('Seeding database...');
        const seedPath = join(__dirname, 'sql', 'seed.sql');
        const seedSQL = fs.readFileSync(seedPath, 'utf8');
        await db.query(seedSQL);
        console.log('Database seeded successfully');
    }

    // Always run practice.sql if it exists
    const practicePath = join(__dirname, 'sql', 'practice.sql');
    if (fs.existsSync(practicePath)) {
        const practiceSQL = fs.readFileSync(practicePath, 'utf8');
        await db.query(practiceSQL);
        console.log('Practice database tables initialized');
    }
    
    return true;
};


// Simple function to test database connection
const testConnection = async () => {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    return true;
};

export { setupDatabase, testConnection };