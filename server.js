import db from './src/models/db.js';
import express from 'express';

// Import MVC components
import { setupDatabase, testConnection } from './src/models/setup.js';

const app = express();


app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});