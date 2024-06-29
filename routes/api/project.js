var express = require("express");
var router = express.Router();

const projectCtrl = require("../../controllers/project.controller");

router.post("/createProject", projectCtrl.createProject);

module.exports = router;