const router = require("express").Router();
const teacherCtrl = require("../controller/TeacherLoginController");

router.post("/signup", teacherCtrl.teacherSignup);
router.post("/login", teacherCtrl.teacherLogin);

module.exports = router;
