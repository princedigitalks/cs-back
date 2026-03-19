var express = require("express");
var router = express.Router();
let {
  createVendorLabel,
  fetchAllVendorLabels,
  fetchVendorLabelById,
  vendorLabelUpdate,
  vendorLabelDelete,
} = require("../controller/vendorLabel");
const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, createVendorLabel);
router.get("/", authMiddleware, fetchAllVendorLabels);
router.get("/:id", authMiddleware, fetchVendorLabelById);
router.put("/:id", authMiddleware, vendorLabelUpdate);
router.delete("/:id", authMiddleware, vendorLabelDelete);

module.exports = router;
