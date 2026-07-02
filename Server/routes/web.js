const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");
const ProjectController = require("../controllers/ProjectController");
const auth = require("../middleware/auth");
const ContactController = require("../controllers/ContactController");
const SkillController = require("../controllers/SkillController");
const UserController = require("../controllers/UserController");
const HeroController = require("../controllers/HeroController");
const AboutController = require("../controllers/AboutController")
const ServicesController = require("../controllers/ServicesController");


// Admin routes
router.post("/register", AdminController.register);
router.post("/admin/login", AdminController.login);
router.get("/logout", auth, AdminController.logout);
router.get("/admin/profile", auth, AdminController.getProfile)
router.put("/updateProfile", auth, AdminController.updateProfile)
router.put("/changePassword", auth, AdminController.changePassword)

// Contact routes
router.post("/createContact", ContactController.createContact);
router.get("/getAllContact", ContactController.getAllContact);

// Skill routes
router.post("/createSkill", SkillController.createSkill);
router.get("/getAllSkill", SkillController.getAllSkill);
router.put("/updateSkill", SkillController.updateSkill);
router.delete("/deleteSkill", SkillController.deleteSkill);

// Project routes
router.post("/createProject", ProjectController.createProject);
router.get("/getAllProjects", ProjectController.getAllProjects);
router.get("/getSingleProject/:id", ProjectController.getSingleProject);
router.put("/updateProject/:id", ProjectController.updateProject)
router.delete("/deleteProject/:id", ProjectController.deleteProject)

// User routes
router.post("/registerUser", UserController.RegisterUser);
router.post("/loginUser", UserController.LoginUser);
router.get("/logoutUser", UserController.LogoutUser);
router.get("/getAllUsers", UserController.getAllUsers);
router.get("/getSingleUser/:id", UserController.getSingleUser);
router.put("/updateUser/:id", UserController.UpdateUser);
router.delete("/deleteUser/:id", UserController.DeleteUser)

// Hero routes
router.post("/createHero", HeroController.createHero);
router.get("/getAllHero", HeroController.getAllHero);
router.get("/getSingleHero/:id", HeroController.getSingleHero);
router.put("/updateHero/:id", HeroController.updateHero);
router.delete("/deleteHero/:id", HeroController.deleteHero);


// About routes
router.post("/createAbout", AboutController.createAbout);
router.get("/about", AboutController.getAbout);
router.put("/updateAbout/:id", AboutController.updateAbout);
router.delete("/deleteAbout/:id", AboutController.deleteAbout);

// Service routes
router.post("/createService", ServicesController.createService);
router.get("/services", ServicesController.getService);
router.get("/getAllServices", ServicesController.getAllServices);
router.get("/getSingleService/:id", ServicesController.getSingleService);
router.put("/updateService/:id", ServicesController.updateService);
router.delete("/deleteService/:id", ServicesController.deleteService);




module.exports = router;