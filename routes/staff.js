var express = require("express");
var router = express.Router();
const createUploader = require("../utils/multer");
const upload = createUploader("images/StaffProfileImages");
let {
  createStaff,
  loginStaff,
  fetchAllStaffs,
  fetchStaffById,
  staffUpdate,
  staffDelete,
  getCurrentStaff,
} = require("../controller/staff");
const authMiddleware = require("../middleware/auth");

router.post("/create", upload.single("profileImage"), createStaff);
router.post("/login", loginStaff);
router.get("/me", authMiddleware, getCurrentStaff);
router.get("/", authMiddleware, fetchAllStaffs);
router.get("/:id", authMiddleware, fetchStaffById);
router.put("/:id", upload.single("profileImage"), authMiddleware, staffUpdate);
router.delete("/:id", authMiddleware, staffDelete);
module.exports = router;
