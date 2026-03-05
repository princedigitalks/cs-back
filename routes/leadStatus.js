var express = require("express");
var router = express.Router();
const {
  createLeadStatus,
  fetchAllLeadStatus,
  fetchLeadStatusById,
  updateLeadStatus,
  deleteLeadStatus,
} = require("../controller/leadStatus");
const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, createLeadStatus);
router.get("/", authMiddleware, fetchAllLeadStatus);
router.get("/:id", authMiddleware, fetchLeadStatusById);
router.put("/:id", authMiddleware, updateLeadStatus);
router.delete("/:id", authMiddleware, deleteLeadStatus);

module.exports = router;
