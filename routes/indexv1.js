var express = require("express");
var router = express.Router();

router.use("/health", require("./health"));
router.use("/staff", require("./staff"));
router.use("/leadStatus", require("./leadStatus"));
router.use("/category", require("./category"));
router.use("/lead", require("./lead"));

module.exports = router;
