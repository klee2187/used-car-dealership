import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';

// Determine the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the CA certificate content
let caCert = null;

try {
    const certPath = path.join(__dirname, '../../bin', 'byuicse-psql-cert.pem');
    console.log("Reading CA certificate from:", certPath);
    caCert = fs.readFileSync(path.join(__dirname, '../../bin', 'byuicse-psql-cert.pem'));
} catch (error) {
    console.warn("Failed to read CA certificate:", error.message);
}

// Determine SSL usage based on environment variables and DB URL
const dbUrl = process.env.DB_URL;
const isLocalDb = dbUrl
    ? /@(localhost|127\.0\.0\.1)(:\d+)?\//i.test(dbUrl)
    : false;
const useSSL = process.env.USE_SSL
    ? process.env.USE_SSL === 'true'
    : !isLocalDb;

if (!dbUrl) {
    throw new Error("DB_URL is not defined in environment variables");
}

// Create a new PostgreSQL connection pool with SSL configuration
const pool = new Pool({ 
    connectionString: dbUrl, 
    ssl: useSSL 
    ? { 
        rejectUnauthorized: true, 
        ca: caCert ? caCert.toString() : undefined
    }
         : false 
});

console.log("USE_SSL:", process.env.USE_SSL);
console.log("SSL Enabled:", useSSL);

// Export a query function that logs queries in development mode
let db = null;

if (process.env.NODE_ENV?.includes('dev') && process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log("SQL Logging Enabled");
    
    // In development with logging enabled, wrap the pool's query method to log queries
    db = {
        async query(text, params) {
            try {
                const start = Date.now();
                const res = await pool.query(text, params);
                const duration = Date.now() - start;
                console.log('Executed query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    duration: `${duration}ms`,
                    rows: res.rowCount
                });
                return res;
            } catch (error) {
                console.error('Error in query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    error: error.message
                });
                throw error;
            }
        },

        async close() {
            await pool.end();
        }
    };
} else {
    // In production, export the pool directly without logging overhead
    db = pool;
}

export default db;
export { caCert };