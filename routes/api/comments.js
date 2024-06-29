var express = require("express");
var router = express.Router();

const commentsCtrl = require("../../controllers/comment.controller");

router.get("/getcomments", commentsCtrl.getComments);
router.post("/:taskId/createcomment", commentsCtrl.createComment);

module.exports = router;