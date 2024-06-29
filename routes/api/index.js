var express = require("express");
const authentication = require("../../middleware/authentication");
const authorization = require("../../middleware/authorization");
var router = express.Router();
const userRoutes = require("./users");
const projectRoutes = require("./project");
const taskRoutes = require("./tasks");
// const sessionRoutes = require('./')

const authRoutes = require("./auth");

// Public Routes
router.use("/auth", authRoutes);
// router.use("/sessions", sessionRoutes);

// Middleware to check token
router.use(authentication);

// Secure Routes
router.use("/user", userRoutes);

router.use("/project", projectRoutes)

router.use("/tasks", taskRoutes)

module.exports = router;
