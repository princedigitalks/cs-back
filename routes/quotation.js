var express = require("express");
var router = express.Router();
let {
  createQuotation,
  fetchAllQuotations,
  fetchQuotationById,
  quotationUpdate,
  quotationDelete,
  fetchQuotationsByLead,
} = require("../controller/quotation");
const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, createQuotation);
router.get("/", authMiddleware, fetchAllQuotations);
router.get("/:id", authMiddleware, fetchQuotationById);
router.get("/lead/:leadId", authMiddleware, fetchQuotationsByLead);
router.put("/:id", authMiddleware, quotationUpdate);
router.delete("/:id", authMiddleware, quotationDelete);

module.exports = router;
