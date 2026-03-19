var express = require("express");
var router = express.Router();
let {
  createVendor,
  fetchAllVendors,
  fetchVendorById,
  vendorUpdate,
  vendorDelete,
} = require("../controller/vendor");
const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, createVendor);
router.get("/", authMiddleware, fetchAllVendors);
router.get("/:id", authMiddleware, fetchVendorById);
router.put("/:id", authMiddleware, vendorUpdate);
router.delete("/:id", authMiddleware, vendorDelete);

module.exports = router;
