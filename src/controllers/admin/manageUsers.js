import { getAllUsers, getUserById, createUser, updateUser as updateUserModel, deleteUser as deleteUserModel } from "../../models/user/User.js";
import bcrypt from "bcrypt";

// GET all users (admin)
export const showAllUsers = async (req, res) => {

    try {
        const users = await getAllUsers();
        res.render("admin/users/manageUser", { 
            title: "Manage All Users", 
            users,
            success: req.flash("success"),
            error: req.flash("error") 
        });

    } catch (error) {
        console.error("Error, could not get all users:", error);
        req.flash("error", "Could not load users. Please try again later.");
        res.redirect("/admin/dashboard");
    }
};

export const showCreateUserForm = async (req, res) => {
    try {

        res.render("admin/users/new", { 
            title: "Create New User",
            success: req.flash("success"),
            error: req.flash("error"),
            user: req.session.user,
        });
    } catch (error) {
        console.error("Error, could not load create user page:", error);
        req.flash("error", "Could not load create user page. Please try again later.");
        return res.redirect("/admin/users/");
    };
};

export const createUserPage = async (req, res) => {
    try {
        const { first_name, last_name, email, username, password, role = "customer" } = req.body;

        const password_hash = await bcrypt.hash(password, 10);
        await createUser({ first_name, last_name, email, username, password_hash, role });

        req.flash("success", "User created successfully");
        return res.redirect("/admin/users/");
    } catch (error) {
        console.error("Error, could not create user:", error);
        req.flash("error", "Could not create user. Please try again later.");
        return res.redirect("/admin/users/new");
    }
};

export const showEditUserForm = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = await getUserById({ user_id: id });

        if (!userData) {
            req.flash("error", "User not found");
            return res.redirect("/admin/users/");
        }

        res.render("admin/users/edit", {
            title: `Edit User - ${userData.first_name} ${userData.last_name}`,
            userData: userData,
            success: req.flash("success"),
            error: req.flash("error"),
            user: req.session.user,
            role: req.session.user.role
        });

    } catch (error) {
        console.error("Error, could not load edit user form:", error);
        req.flash("error", "Could not load edit user form. Please try again later.");
        res.redirect("/admin/users/");
    }
};

export const updateUserPage = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, username, role } = req.body;
        
        const updatedUser = await updateUserModel({
            userId: id,
            first_name, 
            last_name, 
            email, 
            username, 
            role 
        });

        if (!updatedUser) {
            req.flash("error", "User not found");
            return res.redirect("/admin/users/");
        }
        req.flash("success", "User updated successfully");
        res.redirect("/admin/users/");

    } catch (error) {
        console.error("Error, could not update user:", error);
        req.flash("error", "Could not update user. Please try again later.");
        res.redirect("/admin/users/");
    }

}

export const deleteUserPage = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedUser = await deleteUserModel(id);

        if (!deletedUser) { 
            req.flash("error", "User not found");
            return res.redirect("/admin/users/");
        }

        req.flash("success", "User deleted successfully");
        res.redirect("/admin/users/");

    } catch (error) {
        console.error("Error, could not delete user:", error);
        req.flash("error", "Could not delete user. Please try again later.");
        res.redirect("/admin/users/");
    }
};


