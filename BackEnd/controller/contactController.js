const Contact = require("../models/ContactModel");
const { hasTeacherPermission } = require("../utils/teacherPermissions");

// public endpoint - someone fills the contact form
exports.submitContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, purpose, message } = req.body;

    if (!firstName && !lastName && !email && !phone && !message) {
      return res.status(400).json({ success: false, message: "At least one field is required" });
    }

    const newContact = await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      purpose,
      message,
    });

    res.status(201).json({ success: true, data: newContact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// teacher / admin only
exports.getAllContacts = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (!hasTeacherPermission(req, "contacts")) {
      return res.status(403).json({ success: false, message: "Permission denied for contacts" });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// teacher / admin: count endpoint used for dashboard stat
exports.getContactCount = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (!hasTeacherPermission(req, "contacts")) {
      return res.status(403).json({ success: false, message: "Permission denied for contacts" });
    }

    const count = await Contact.countDocuments();
    res.json({ success: true, count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
