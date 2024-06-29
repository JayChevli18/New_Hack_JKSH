var express = require("express");
var router = express.Router();

const userCtrl = require("../../controllers/user.controller");

router.get("/me", userCtrl.me);
router.post("/change-password", userCtrl.changePassword);
router.post("/logout", userCtrl.logout);
router.get("/personalusers", userCtrl.personalUsers);

module.exports = router;