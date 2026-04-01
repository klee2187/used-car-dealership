//------------Import dependencies and controllers------------
import { Router } from "express";
import { showCategories, showCategoryBySlug } from "./categories/categories.js";
import { showAllVehicles,  showVehicleBySlug } from "./vehicles/vehicles.js";
import { showRegistrationForm, registerUser, showLoginForm, loginUser, logoutUser, showProfile } from "./users/users.js";
import { isAdmin } from "../middleware/role.js";
import { showAllUsers, showAdminDashboard } from "./admin/admin.js";
import { requireLogin } from "../middleware/auth.js";

//------------Initialize Router------------
const router = Router();

// ------------Routes------------
router.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});
router.get("/about", (req, res) => {
    res.render("about", { title: "About Auto-Correct Motors" });
});
router.get("/contact/form", (req, res) => {
    res.render("forms/contact/form", {title: "Contact Us"});
});

//------------Admin routes------------
router.get("/admin/users", requireLogin, isAdmin, showAllUsers);
router.get("/admin/dashboard", requireLogin, isAdmin, showAdminDashboard);

//------------Category routes------------
router.get("/categories", showCategories);
router.get("/categories/:slug", showCategoryBySlug);

//------------Vehicle routes------------
router.get("/vehicles", showAllVehicles);
router.get("/vehicles/:slug", showVehicleBySlug);

//------------User routes------------
router.get("/register", showRegistrationForm);
router.post("/register", registerUser);

router.get("/login", showLoginForm);
router.post("/login", loginUser);

router.get("/logout", logoutUser);
router.get("/profile", showProfile);

//------------Error handling middleware------------
router.use((req, res) => {
    res.status(404).render("errors/404", { title: "Page Not Found" });
});
router.use((err, req, res, next) => {
    console.error("An error occurred:", err);
    res.status(500).send("Internal Server Error");
});

export default router;