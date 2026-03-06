const Student = require("../models/StudentModel");
const Request = require("../models/RequestModel");
const bcrypt = require("bcryptjs");

/* ================= CREATE PASSWORD RESET REQUEST ================= */
// Student submits password reset request (without login - by enrollment)
exports.createPasswordResetRequest = async (req, res) => {
  try {
    const { enroll } = req.body;

    if (!enroll) {
      return res.status(400).json({ success: false, message: "Enrollment number is required" });
    }

    // Find student by enrollment
    const student = await Student.findOne({ enroll, isDeleted: false });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found with this enrollment number" });
    }

    // Check if there's already a pending password reset request
    const existingRequest = await Request.findOne({
      studentId: student._id,
      requestType: "student_password_reset",
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: "You already have a pending password reset request. Please wait for it to be processed." 
      });
    }

    // Create password reset request
    const newRequest = await Request.create({
      studentId: student._id,
      requestType: "student_password_reset",
      category: "password_reset",
      details: "Password reset requested by student",
      requesterName: student.name,
      requesterIdentifier: student.enroll
    });

    res.status(201).json({ 
      success: true, 
      message: "Password reset request submitted successfully",
      studentName: student.name
    });
  } catch (err) {
    console.error("Create Password Reset Request Error:", err);
    res.status(500).json({ success: false, message: "Failed to submit request" });
  }
};

/* ================= GET STUDENT'S PASSWORD RESET STATUS ================= */
// Student checks their own password reset request status
exports.getPasswordResetStatus = async (req, res) => {
  try {
    // Validate that userId exists and is valid
    const studentId = req.user?.userId;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication. Please login again.",
      });
    }
    
    const request = await Request.findOne({
      studentId,
      requestType: "student_password_reset"
    }).sort({ createdAt: -1 });

    if (!request) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: request });
  } catch (err) {
    console.error("Get Password Reset Status Error:", err);
    res.status(500).json({ success: false, message: "Failed to get status" });
  }
};

/* ================= GET ALL PASSWORD RESET REQUESTS ================= */
// Teacher/Admin gets all password reset requests
exports.getAllPasswordResetRequests = async (req, res) => {
  try {
    // Check role
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const requests = await Request.find({ requestType: "student_password_reset" })
      .populate("studentId", "name enroll email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("Get All Password Reset Requests Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch requests" });
  }
};

/* ================= REJECT STUDENT PASSWORD RESET REQUEST ================= */
// Teacher/Admin rejects student's password reset request
exports.rejectStudentPasswordResetRequest = async (req, res) => {
  try {
    // Check role
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const { rejectReason } = req.body;

    // Find the password reset request
    const resetRequest = await Request.findById(id);
    if (!resetRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (resetRequest.requestType !== "student_password_reset") {
      return res.status(400).json({ success: false, message: "Invalid request type" });
    }

    if (resetRequest.status !== "pending") {
      return res.status(400).json({ success: false, message: "Request is not pending" });
    }

    // Update request status to rejected
    resetRequest.status = "rejected";
    resetRequest.details = `Rejected by teacher/admin on ${new Date().toLocaleString()}. Reason: ${rejectReason || "Not provided"}`;
    await resetRequest.save();

    res.json({ success: true, message: "Request rejected successfully" });
  } catch (err) {
    console.error("Reject Student Password Reset Request Error:", err);
    res.status(500).json({ success: false, message: "Failed to reject request" });
  }
};

/* ================= RESET STUDENT PASSWORD ================= */
// Teacher/Admin resets student's password
exports.resetStudentPassword = async (req, res) => {
  try {
    // Check role
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { requestId, newPassword } = req.body;

    if (!requestId || !newPassword) {
      return res.status(400).json({ success: false, message: "Request ID and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Find the password reset request
    const resetRequest = await Request.findById(requestId);
    if (!resetRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (resetRequest.requestType !== "student_password_reset") {
      return res.status(400).json({ success: false, message: "Invalid request type" });
    }

    // Find the student
    const student = await Student.findById(resetRequest.studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    
    // Clear any existing reset tokens
    student.resetToken = null;
    student.resetTokenExpiry = null;
    await student.save();

    // Update request status to approved
    resetRequest.status = "approved";
    resetRequest.details = `Password reset by teacher/admin on ${new Date().toLocaleString()}`;
    await resetRequest.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Student Password Error:", err);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};

/* ================= LEGACY FUNCTIONS (DEPRECATED) ================= */
// These functions are kept for backward compatibility but are not used in the new flow

exports.sendResetLink = async (req, res) => {
  // This function is deprecated - use createPasswordResetRequest instead
  return res.status(410).json({ 
    message: "This method is no longer supported. Please use the password reset request system." 
  });
};

exports.resetPassword = async (req, res) => {
  // This function is deprecated - use resetStudentPassword instead
  return res.status(410).json({ 
    message: "This method is no longer supported. Please use the password reset request system." 
  });
};

