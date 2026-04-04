//------------Import dependencies and controllers------------
import { Router } from "express";
import { showAdminDashboard } from "./admin/admin.js";
import { requireLogin } from "../middleware/auth.js";
import { isAdmin, isEmployee } from "../middleware/role.js";
import contactRoutes from "./forms/contact.js";
import serviceRequestRoutes from "./forms/serviceRequest.js";
import reviewRoutes from "./forms/review.js";
import { showCategories, showCategoryBySlug } from "./categories/categories.js";
import { showAllVehicles,  showVehicleBySlug } from "./vehicles/vehicles.js";
import { showProfile, updateProfile } from "./profile/profile.js";
import { showAllReviews, deleteReview } from "./admin/manageReviews.js";
import { showRegistrationForm, registerUser, registerValidation } from "./forms/register.js";
import { loginValidation, showLoginForm, loginUser, logoutUser  } from "./forms/login.js";
import { showUserMessages,  } from "./admin/manageMessages.js";
import { showAllServiceRequests, updateRequestStatus } from "./admin/manageRequests.js";
import { showAllUsers, showEditUserForm, showCreateUserForm, createUserPage, updateUserPage, deleteUserPage } from "./admin/manageUsers.js";
import { showManageVehicles, createVehiclePage, updateVehiclePage, deleteVehiclePage, showAddVehicleForm, showEditVehicleForm } from "./admin/manageVehicles.js";

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
router.get("/admin/dashboard", requireLogin, isEmployee, showAdminDashboard);
router.get("/employee/dashboard", requireLogin, isEmployee, showAdminDashboard);

router.get("/admin/users/", requireLogin, isEmployee, showAllUsers);

router.get("/admin/users/:id/edit", requireLogin, isAdmin, showEditUserForm);
router.post("/admin/users/:id/edit", requireLogin, isAdmin, updateUserPage);

router.post("/admin/users/:id/delete", requireLogin, isAdmin, deleteUserPage);

router.get("/admin/users/new", requireLogin, isAdmin, showCreateUserForm);
router.post("/admin/users/new", requireLogin, isAdmin, createUserPage);

router.get("/admin/manageVehicles", requireLogin, isEmployee, showManageVehicles);

router.get("/admin/vehicles/new", requireLogin, isAdmin, showAddVehicleForm);
router.post("/admin/vehicles/new", requireLogin, isAdmin, createVehiclePage);

router.get("/admin/vehicles/:id/edit", requireLogin, isAdmin, showEditVehicleForm);
router.post("/admin/vehicles/:id/edit", requireLogin, isAdmin, updateVehiclePage);

router.post("/admin/vehicles/:id/delete", requireLogin, isAdmin, deleteVehiclePage);

router.get("/admin/manageMessages", requireLogin, isEmployee, showUserMessages);
router.get("/admin/messages", requireLogin, isEmployee, showUserMessages);
router.post("/admin/manageMessages/:id/delete", requireLogin, isAdmin, async (req, res) => {
    if (req.session.user.role !== "admin") {
        req.flash("error", "You must be an admin to delete messages.");
        return res.redirect("/admin/manageMessages");
    }
});
router.post("/admin/manageMessages/:id/reply", requireLogin, isAdmin, async (req, res) => {
    if (req.session.user.role !== "admin") {
        req.flash("error", "You must be an admin to reply to messages.");
        return res.redirect("/admin/manageMessages");
    }
});

router.get("/admin/manageRequests", requireLogin, isEmployee, showAllServiceRequests);
router.get("/admin/requests", requireLogin, isEmployee, showAllServiceRequests);
router.post("/admin/manageRequests/:id/status", requireLogin, isEmployee, updateRequestStatus);
router.post("/admin/requests/:id/status", requireLogin, isEmployee, updateRequestStatus);

router.get("/admin/manageReviews", requireLogin, isEmployee, showAllReviews);
router.post("/admin/manageReviews/:id/delete", requireLogin, isAdmin, deleteReview);

//------------User routes------------
router.get("/register", showRegistrationForm);
router.post("/register", registerValidation, registerUser);

router.get("/login", showLoginForm);
router.post("/login", loginValidation, loginUser); 

router.get("/logout", logoutUser);
router.get("/profile", requireLogin, showProfile);
router.post("/profile", requireLogin, updateProfile);

//------------Form Routes------------
router.use("/contact", contactRoutes);
router.use("/serviceRequest", requireLogin, serviceRequestRoutes);
router.use("/reviews", requireLogin, reviewRoutes);

//------------Error handling middleware------------
router.use((req, res) => {
    res.status(404).render("errors/404", { title: "Page Not Found" });
});
router.use((err, req, res, next) => {
    console.error("An error occurred:", err);
    res.status(500).send("Internal Server Error");
});

export default router;