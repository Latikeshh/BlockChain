const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth"); // ✅ ADD THIS

const {
  saveOrUpdateProfile,
  getMyProfile,
  deleteProfile,
} = require("../controller/studentProfileController");

/* ================= CREATE OR UPDATE PROFILE ================= */
router.post("/save",  auth, upload.single("photo"),   // image upload middleware
  saveOrUpdateProfile
);

router.get("/me", auth, getMyProfile);

router.delete("/delete", auth, deleteProfile);

module.exports = router;
