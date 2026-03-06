const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const {
  saveProfile,
  getMyProfile,
  deleteProfile,
  getProfileById,   // ✅ IMPORT NEW
} = require("../controller/studentProfileController");

router.post("/save", auth, upload.single("photo"), saveProfile);

router.get("/me", auth, getMyProfile);

router.delete("/delete", auth, deleteProfile);

/* ✅ NEW ROUTE */
router.get("/view/:studentId", auth, getProfileById);

module.exports = router;