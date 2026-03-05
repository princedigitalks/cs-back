var express = require("express");
var router = express.Router();
let {
  createLead,
  fetchAllLeads,
  fetchLeadById,
  leadUpdate,
  leadDelete,
} = require("../controller/lead");
const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, createLead);
router.get("/", authMiddleware, fetchAllLeads);
router.get("/:id", authMiddleware, fetchLeadById);
router.put("/:id", authMiddleware, leadUpdate);
router.delete("/:id", authMiddleware, leadDelete);

module.exports = router;
