import { Router } from "express";
import { showCategories, showCategoryBySlug } from "./category/category.js";
import { showAllVehicles,  showVehicleBySlug } from "./vehicle/vehicle.js";
import { registerUser } from "./forms/register.js";
import { showRegistrationForm, showLoginForm, loginUser, logoutUser, showProfile } from "./user/user.js";

// Create a new router instance
const router = Router();

// Category routes
router.get("/categories", showCategories);
router.get("/categories/:slug", showCategoryBySlug);

// Vehicle routes
router.get("/vehicle", showAllVehicles);
router.get("/vehicle/:slug", showVehicleBySlug);

// User registration routes
router.get("/register", showRegistrationForm);
router.post("/register", registerUser);
router.get("/login", showLoginForm);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", showProfile);

export default router;