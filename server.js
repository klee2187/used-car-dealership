// ------------Import necessary modules------------
import express from "express";
import session from "express-session";
import flash from "connect-flash";
import path from "path";
import { fileURLToPath } from "url";
import connectPgSimple from "connect-pg-simple";
import dotenv from "dotenv";

import db, { caCert } from "./src/models/db.js";
import { setupDatabase, testConnection } from "./src/models/setup.js";
import router from "./src/controllers/routes.js";
dotenv.config();

// ------------Setup __dirname for ES modules------------
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

//------------Configure Express App------------
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";

// ------------Static files------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ------------Session Configuration------------
const pgSession = connectPgSimple(session);

app.use(session({
    store: new pgSession({
        pool: db,
        tableName: "session",
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV === "production", // Use secure cookies in production
        httpOnly: true,
        sameSite: NODE_ENV === "production" ? "none" : "lax", // Use "none" for production to allow cross-site cookies, "lax" for development
        maxAge: 24 * 60 *60 * 1000 // 1 day
    }
}));

//------------Flash Messages Middleware------------
app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// ------------Use Routes------------
app.use("/", router);

// ------------Test Route for Session------------
app.get("/test-session", (req, res) => {
  req.session.test = "working";
  res.send("Session saved");
});

// ------------Start the Server------------
app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`Server is running on http://127.0.0.1:${PORT}`); 
});