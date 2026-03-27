import { Router } from 'express';
import { showCategories, showCategoryBySlug } from './category/category.js';
import { showAllVehicles,  showVehicleBySlug } from './vehicle/vehicle.js';
import { registerUser } from './forms/register.js';

// Create a new router instance
const router = Router();

// Category routes
router.get('/categories', showCategories);
router.get('/categories/:slug', showCategoryBySlug);

// Vehicle routes
router.get('/vehicle', showAllVehicles);
router.get('/vehicle/:slug', showVehicleBySlug);



export default router;