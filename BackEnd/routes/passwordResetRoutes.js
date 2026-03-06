const router = require("express").Router();
const passwordResetCtrl = require("../controller/passwordResetController");
const auth = require("../middleware/auth");

// Student submits password reset request (without login)
router.post("/password-reset-request", passwordResetCtrl.createPasswordResetRequest);

// Student checks their password reset request status
router.get("/password-reset-status", auth, passwordResetCtrl.getPasswordResetStatus);

// Teacher/Admin: Get all password reset requests
router.get("/password-reset-requests", auth, passwordResetCtrl.getAllPasswordResetRequests);

// Teacher/Admin: Reset student password
router.post("/reset-student-password", auth, passwordResetCtrl.resetStudentPassword);

// Teacher/Admin: Reject student password reset request
router.put("/password-reset-request/:id/reject", auth, passwordResetCtrl.rejectStudentPasswordResetRequest);

// DEPRECATED: Keep for backward compatibility
router.post("/forgot-password", passwordResetCtrl.sendResetLink);
router.post("/reset-password", passwordResetCtrl.resetPassword);

module.exports = router;

