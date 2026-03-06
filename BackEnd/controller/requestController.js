const Request = require("../models/RequestModel");
const { hasTeacherPermission } = require("../utils/teacherPermissions");

// create a new change request by a student
exports.createRequest = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { category, details } = req.body;

    if (!category || !details) {
      return res.status(400).json({
        success: false,
        message: "Category and details are required",
      });
    }

    const newReq = await Request.create({
      studentId,
      category,
      details,
    });

    res.status(201).json({ success: true, data: newReq });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get requests submitted by the currently logged-in student
exports.getMyRequests = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const requests = await Request.find({ studentId }).sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// teacher/admin: fetch all requests
exports.getAllRequests = async (req, res) => {
  try {
    // basic role check
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (!hasTeacherPermission(req, "changeRequests")) {
      return res.status(403).json({ success: false, message: "Permission denied for change requests" });
    }

    const requests = await Request.find()
      .populate("studentId", "name enroll")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// teacher/admin: update request status
exports.updateRequestStatus = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (!hasTeacherPermission(req, "changeRequests")) {
      return res.status(403).json({ success: false, message: "Permission denied for change requests" });
    }

    const { id } = req.params;
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const reqDoc = await Request.findById(id);
    if (!reqDoc) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    reqDoc.status = status;
    await reqDoc.save();

    res.json({ success: true, data: reqDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
