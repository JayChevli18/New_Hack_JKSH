var express = require("express");
var router = express.Router();

const taskCtrl = require("../../controllers/task.controller");
const pdfUpload = require("../../middleware/file-upload")

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
module.exports = router;
