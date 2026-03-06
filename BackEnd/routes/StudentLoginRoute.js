const router = require("express").Router();
const studentCtrl = require("../controller/StudentLoginController");
const auth = require("../middleware/auth");

// Student Authentication
router.post("/signup", studentCtrl.studentSignup);
router.post("/login", studentCtrl.studentLogin);
router.get("/count", studentCtrl.countStudents);

// Student List & Search
router.get("/getst", studentCtrl.getStudents);
router.get("/searchst", studentCtrl.searchStudents);

// Student Update
router.put("/:id", studentCtrl.updateStudent);

// Student Verification (teachers/admins only)
router.put("/verify/:id", auth, studentCtrl.verifyStudent);
router.put("/unverify/:id", auth, studentCtrl.unverifyStudent);
// Simple verification - only sets verify flag without touching form
router.put("/simpleverify/:id", auth, studentCtrl.simpleVerifyStudent);
// send feedback / request changes before verify
router.put("/reject/:id", auth, studentCtrl.rejectStudent);

// Verified Students (Protected)
router.get("/verified", auth, studentCtrl.getVerifiedStudents);

// Admin Routes (Protected)
router.get("/students", auth, studentCtrl.getAllStudents);
router.get("/students/:id", auth, studentCtrl.getStudentById);
router.get("/students/:id/profile", auth, studentCtrl.getStudentProfile);
router.get("/pending", auth, studentCtrl.getPendingStudents);
router.delete("/student/:id", auth, studentCtrl.deleteStudent);

// Count Routes (Protected)
router.get("/verified/count", auth, studentCtrl.getVerifiedCount);
router.get("/pending/count", auth, studentCtrl.getPendingCount);

module.exports = router;
