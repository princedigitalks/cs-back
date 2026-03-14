var express = require("express");
var router = express.Router();
let {
  createOrderStatus,
  fetchAllOrderStatuses,
  fetchOrderStatusById,
  updateOrderStatus,
  deleteOrderStatus,
} = require("../controller/orderStatus");
const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, createOrderStatus);
router.get("/", authMiddleware, fetchAllOrderStatuses);
router.get("/:id", authMiddleware, fetchOrderStatusById);
router.put("/:id", authMiddleware, updateOrderStatus);
router.delete("/:id", authMiddleware, deleteOrderStatus);

module.exports = router;
