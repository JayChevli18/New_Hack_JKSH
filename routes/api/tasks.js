var express = require("express");
var router = express.Router();

const taskCtrl = require("../../controllers/task.controller");
const pdfUpload = require("../../middleware/file-upload");

router.post(
  "/:projectId/createTasks",
  pdfUpload.fileUpload(
    "tasks",
    ["pdf", "image"],
    [
      {
        name: "task",
        maxCount: 1,
      },
    ]
  ),
  taskCtrl.createTasks
);

router.get("/:projectId/allTasks", taskCtrl.getAllTasks);
router.get("/:taskId/task", taskCtrl.getParticularTask);
router.put(
  "/:taskId/updateTask",
  pdfUpload.fileUpload(
    "tasks",
    ["pdf", "image"],
    [
      {
        name: "task",
        maxCount: 1,
      },
    ]
  ),
  taskCtrl.updateTask
);
router.delete("/:taskId/deleteTask", taskCtrl.deleteTask)
module.exports = router;
