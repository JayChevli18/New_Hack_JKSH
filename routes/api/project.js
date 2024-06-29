var express = require("express");
var router = express.Router();

const projectCtrl = require("../../controllers/project.controller");

router.post("/createProject", projectCtrl.createProject);
router.get("/getCreatorProject", projectCtrl.getUserProjects);
router.get("/getAllCreatorsProjects", projectCtrl.getAllCreatorsProjects);
router.put("/:projectId/updateProject", projectCtrl.updateProject);
router.delete("/:projectId/deleteProject",projectCtrl.deleteProject);

module.exports = router;