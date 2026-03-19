import 'dotenv/config';
import db from './src/models/db.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);


// Import MVC components
import { setupDatabase, testConnection } from './src/models/setup.js';

const app = express();

const PORT = process.env.PORT || 3000;

// Static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

const sampleVehicles = [
    { id: 1, year: 2021, make: "Toyota", model: "Camry", price: 24995, mileage: 32000, image: "/images/car1.jpg" },
    { id: 2, year: 2020, make: "Honda", model: "Civic", price: 21995, mileage: 41000, image: "/images/car2.jpg" },
    { id: 3, year: 2019, make: "Ford", model: "Escape", price: 19995, mileage: 55000, image: "/images/car3.jpg" }
];

app.get("/vehicles", (req, res) => {
    res.render("vehicles/index", { title: "Browse Vehicles", vehicles: sampleVehicles });
});

app.get("/vehicles/:id", (req, res) => {
    const vehicle = sampleVehicles.find(v => v.id === Number(req.params.id));
    if (!vehicle) return res.status(404).send("Vehicle not found");
        res.render("vehicles/detail", { title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`, vehicle });
});

app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`Server is running on http://127.0.0.1:${PORT}`); 
});