var express = require("express");
const authentication = require("../../middleware/authentication");
const authorization = require("../../middleware/authorization");
var router = express.Router();

const authRoutes = require("./auth");

// Public Routes
router.use("/auth", authRoutes);
// router.use("/sessions", sessionRoutes);

module.exports = router;
