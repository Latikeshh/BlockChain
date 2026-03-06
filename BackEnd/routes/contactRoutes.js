const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  submitContact,
  getAllContacts,
  getContactCount,
} = require("../controller/contactController");

// public submission
router.post("/", submitContact);

// teacher/admin endpoints
router.get("/all", auth, getAllContacts);
router.get("/count", auth, getContactCount);

module.exports = router;
