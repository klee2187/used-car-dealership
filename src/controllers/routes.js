//------------Import dependencies and controllers------------
import { Router } from "express";
import { showCategories, showCategoryBySlug } from "./categories/categories.js";
import { showAllVehicles,  showVehicleBySlug } from "./vehicles/vehicles.js";
import { showProfile } from "./profile/profile.js";
import { isAdmin } from "../middleware/role.js";
import { showAllUsers, showAdminDashboard } from "./admin/admin.js";
import { requireLogin } from "../middleware/auth.js";
import { showRegistrationForm, registerUser, registerValidation } from "./forms/register.js";
import { loginValidation, showLoginForm, loginUser, logoutUser  } from "./forms/login.js";
import contactRoutes from "./forms/contact.js";

//------------Initialize Router------------
const router = Router();

// ------------Static Page Routes------------
router.get("/", (req, res) => {
    res.render("home", { title: "Home" });
});
router.get("/about", (req, res) => {
    res.render("about", { title: "About Auto-Correct Motors" });
});

//------------Category routes------------
router.get("/categories", showCategories);
router.get("/categories/:slug", showCategoryBySlug);

//------------Vehicle routes------------
router.get("/vehicles", showAllVehicles);
router.get("/vehicles/:slug", showVehicleBySlug);

//------------Admin routes------------
router.get("/admin/users", requireLogin, isAdmin, showAllUsers);
router.get("/admin/dashboard", requireLogin, isAdmin, showAdminDashboard);
router.post("/admin/users/update", requireLogin, isAdmin, showAllUsers);
router.post("/admin/users/delete", requireLogin, isAdmin, showAllUsers);

//------------Employee routes------------
router.get("/employee/dashboard", requireLogin, (req, res) => {
    if (req.session.user.role === "employee") {
        res.render("employee/dashboard", { title: "Employee Dashboard" });
    } else {
        req.flash("error", "Access denied. Employees only.");
        res.redirect("/");
    }
});

//------------User routes------------
router.get("/register", showRegistrationForm);
router.post("/register", registerValidation, registerUser);

router.get("/login", showLoginForm);
router.post("/login", loginValidation, loginUser); 

router.get("/logout", logoutUser);
router.get("/profile", requireLogin, showProfile);

//------------Form Routes------------
router.use("/contact", contactRoutes);

//------------Error handling middleware------------
router.use((req, res) => {
    res.status(404).render("errors/404", { title: "Page Not Found" });
});
router.use((err, req, res, next) => {
    console.error("An error occurred:", err);
    res.status(500).send("Internal Server Error");
});

export default router;