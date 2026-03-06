const express = require("express");
const router = express.Router();

const studentController = require("../controller/BlockController");

router.post("/saveStudent", studentController.saveStudent);
router.get("/student/:id", studentController.getStudent);
router.get("/allblocks", studentController.getAllBlocks);
router.get("/student/enroll/:enroll", studentController.getStudentByEnroll);
router.post("/savebydatabase", studentController.savebydatabase);

module.exports = router;