var express = require("express");
var router = express.Router();
const apiRoutes = require("./api");
const environment = require("../utils/environment");

/* GET home page. */
// router.get("/", function (req, res) {
//   res.redirect(environment.google.reactUrl);
// });
router.get("/ping", function (req, res) {
  res.send("pong");
});

router.use("/api", apiRoutes);

module.exports = router;
