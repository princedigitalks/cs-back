var express = require("express");
var router = express.Router();
const {
  createCategory,
  fetchAllCategories,
  fetchCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controller/category");
const authMiddleware = require("../middleware/auth");

router.post("/create", authMiddleware, createCategory);
router.get("/", authMiddleware, fetchAllCategories);
router.get("/:id", authMiddleware, fetchCategoryById);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;
