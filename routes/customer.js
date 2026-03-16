var express = require("express");
var router = express.Router();
const {
  fetchAllCustomers,
  fetchCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controller/customer");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, fetchAllCustomers);
router.get("/:id", authMiddleware, fetchCustomerById);
router.put("/:id", authMiddleware, updateCustomer);
router.delete("/:id", authMiddleware, deleteCustomer);

module.exports = router;
