const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const formCtrl = require("../controller/studentFormController");

// student endpoints
router.post("/", auth, upload.single("photo"), formCtrl.submitForm);
router.put("/update", auth, upload.none(), formCtrl.updateStudentForm);
router.get("/me", auth, formCtrl.getMyForm);

// teacher/admin endpoints
router.get("/all", auth, formCtrl.getAllForms);
router.put("/verify/:id", auth, formCtrl.verifyForm);
router.put("/reject/:id", auth, formCtrl.rejectForm);
router.delete("/enroll/:enroll", auth, formCtrl.deleteFormByEnroll);

module.exports = router;
