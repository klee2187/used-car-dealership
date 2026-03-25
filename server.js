import db, { caCert } from './src/models/db.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// import MVC components
import { setupDatabase, testConnection } from './src/models/setup.js';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';



// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

// Create Express app
const app = express();

// Static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize PostgreSQL session store
const pgSession = connectPgSimple(session);

app.use(session({
    store: new pgSession({
        pool: db,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        sameSite: NODE_ENV === 'production' ? 'none' : 'lax', // Use 'none' for production to allow cross-site cookies, 'lax' for development
        maxAge: 24 * 60 *60 * 1000 // 1 day
    }
}));

// Routes
app.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});

// Test that sessions work
app.get("/test-session", (req, res) => {
  req.session.test = "working";
  res.send("Session saved");
});


// Start server
app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`Server is running on http://127.0.0.1:${PORT}`); 
});