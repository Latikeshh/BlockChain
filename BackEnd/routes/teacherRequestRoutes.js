const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createRequest,
  getMyRequests,
  getApprovedRequest,
  submitUpdatedProfile,
  getAllRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  getStudentCurrentData,
} = require("../controller/teacherRequestController");

// ================= STUDENT ROUTES =================

// Student creates a new request
router.post("/", auth, createRequest);

// Student gets their own requests
router.get("/me", auth, getMyRequests);

// Student gets their approved request (for editing)
router.get("/me/approved", auth, getApprovedRequest);

// Student submits updated profile (this deletes old blockchain block)
router.post("/:requestId/submit", auth, submitUpdatedProfile);

// ================= TEACHER/ADMIN ROUTES =================

// Teacher/Admin gets all requests (with optional status filter)
router.get("/all", auth, getAllRequests);

// Teacher/Admin gets a specific request by ID
router.get("/:id", auth, getRequestById);

// Teacher/Admin approves a request
router.put("/:id/approve", auth, approveRequest);

// Teacher/Admin rejects a request
router.put("/:id/reject", auth, rejectRequest);

// Teacher/Admin gets student current profile data
router.get("/student/:studentId/data", auth, getStudentCurrentData);

module.exports = router;

