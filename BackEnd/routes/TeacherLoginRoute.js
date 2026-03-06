const router = require("express").Router();
const teacherCtrl = require("../controller/TeacherLoginController");
const auth = require("../middleware/auth");

// Teacher Auth Routes
router.post("/signup", teacherCtrl.teacherSignup);
router.post("/login", teacherCtrl.teacherLogin);

// Teacher Management Routes
router.get("/teachers", auth, teacherCtrl.getAllTeachers);
router.get("/teachers/count", auth, teacherCtrl.getTeacherCount);
router.get("/:id", auth, teacherCtrl.getTeacherById);
router.put("/:id", auth, teacherCtrl.updateTeacher);
router.delete("/:id", auth, teacherCtrl.deleteTeacher);

module.exports = router;
