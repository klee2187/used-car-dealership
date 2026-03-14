import db from './src/models/db.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import MVC components
import setupRoutes from './src/controllers/routes.js';  
import session from 'express-session';
import { setupDatabase, testConnection } from './src/models/setup.js';

const app = express();

app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});