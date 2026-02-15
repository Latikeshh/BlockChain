const router = require("express").Router();
const studentCtrl = require("../controller/StudentLoginController");

router.post("/signup", studentCtrl.studentSignup);
router.post("/login", studentCtrl.studentLogin);
router.get("/count", studentCtrl.countStudents);

/* LIST */
router.get("/getst", studentCtrl.getStudents);

/* SEARCH */
router.get("/searchst", studentCtrl.searchStudents);

/* UPDATE */
router.put("/:id", studentCtrl.updateStudent);

router.put("/verify/:id", studentCtrl.verifyStudent);
router.put("/unverify/:id", studentCtrl.unverifyStudent);

module.exports = router;
