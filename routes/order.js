var express = require("express");
var router = express.Router();
let {
  createOrderFromQuotation,
  createOrderManually,
  fetchAllOrders,
  fetchOrderById,
  orderUpdate,
  orderDelete,
} = require("../controller/order");
const authMiddleware = require("../middleware/auth");

router.post("/create/quotation", authMiddleware, createOrderFromQuotation);
router.post("/create/manual", authMiddleware, createOrderManually);
router.get("/", authMiddleware, fetchAllOrders);
router.get("/:id", authMiddleware, fetchOrderById);
router.put("/:id", authMiddleware, orderUpdate);
router.delete("/:id", authMiddleware, orderDelete);

module.exports = router;
