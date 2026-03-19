var express = require("express");
var router = express.Router();

router.use("/health", require("./health"));
router.use("/dashboard", require("./dashboard"));
router.use("/staff", require("./staff"));
router.use("/leadStatus", require("./leadStatus"));
router.use("/category", require("./category"));
router.use("/lead", require("./lead"));
router.use("/quotation", require("./quotation"));
router.use("/order", require("./order"));
router.use("/orderStatus", require("./orderStatus"));
router.use("/customer", require("./customer"));
router.use("/vendorLabel", require("./vendorLabel"));
router.use("/vendor", require("./vendor"));

module.exports = router;
