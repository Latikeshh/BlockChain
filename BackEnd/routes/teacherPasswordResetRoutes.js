const router = require("express").Router();
const teacherPasswordResetCtrl = require("../controller/teacherPasswordResetController");
const auth = require("../middleware/auth");

// Teacher submits password reset request to admin (without login)
router.post("/password-reset-request", teacherPasswordResetCtrl.createTeacherPasswordResetRequest);

// Teacher checks their password reset request status
router.get("/password-reset-status", auth, teacherPasswordResetCtrl.getTeacherPasswordResetStatus);

// Admin: Get all teacher password reset requests
router.get("/password-reset-requests", auth, teacherPasswordResetCtrl.getAllTeacherPasswordResetRequests);

// Admin: Reset teacher password
router.post("/reset-teacher-password", auth, teacherPasswordResetCtrl.resetTeacherPassword);

// Admin: Reject teacher password reset request
router.put("/password-reset-request/:id/reject", auth, teacherPasswordResetCtrl.rejectTeacherPasswordResetRequest);

// Reset password using token (existing functionality)
router.post("/reset-password", teacherPasswordResetCtrl.resetPassword);

module.exports = router;

