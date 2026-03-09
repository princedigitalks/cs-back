var express = require("express");
var router = express.Router();
let {
  createOrder,
  fetchAllOrders,
  fetchOrderById,
  orderUpdate,
  orderDelete,
  fetchOrdersByLead,
} = require("../controller/order");
const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, createOrder);
router.get("/", authMiddleware, fetchAllOrders);
router.get("/:id", authMiddleware, fetchOrderById);
router.get("/lead/:leadId", authMiddleware, fetchOrdersByLead);
router.put("/:id", authMiddleware, orderUpdate);
router.delete("/:id", authMiddleware, orderDelete);

module.exports = router;
