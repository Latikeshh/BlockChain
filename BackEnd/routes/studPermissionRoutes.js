const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  requestPermission,
  getMyPermissions,
  getPermissionStatus,
  getAllPendingPermissions,
  respondToPermission,
  getAllPermissions,
} = require("../controller/studPermissionController");

// Middleware to check if user is a teacher
const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ 
      success: false, 
      message: "Access denied. Teachers only." 
    });
  }
  next();
};

// Student routes
router.post("/request", auth, requestPermission);
router.get("/my", auth, getMyPermissions);
router.get("/status/:permissionType", auth, getPermissionStatus);

// Teacher routes
router.get("/pending", auth, isTeacher, getAllPendingPermissions);
router.get("/all", auth, isTeacher, getAllPermissions);
router.put("/respond/:permissionId", auth, isTeacher, respondToPermission);

module.exports = router;

