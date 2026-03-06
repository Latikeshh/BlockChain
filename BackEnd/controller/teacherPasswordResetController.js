const Teacher = require("../models/TeacherModel");
const Request = require("../models/RequestModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

/* ================= TEACHER: Create Password Reset Request ================= */
// Teacher submits password reset request to admin (without login)
exports.createTeacherPasswordResetRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found with this email address" });
    }

    // Check if there's already a pending password reset request
    const existingRequest = await Request.findOne({
      teacherId: teacher._id,
      requestType: "teacher_password_reset",
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
      teacherId: teacher._id,
      requestType: "teacher_password_reset",
      category: "password_reset",
      details: "Password reset requested by teacher",
      requesterName: teacher.name,
      requesterIdentifier: teacher.email
    });

    res.status(201).json({ 
      success: true, 
      message: "Password reset request submitted successfully. Admin will review and reset your password.",
      teacherName: teacher.name
    });
  } catch (err) {
    console.error("Create Teacher Password Reset Request Error:", err);
    res.status(500).json({ success: false, message: "Failed to submit request" });
  }
};

/* ================= TEACHER: Get Password Reset Status ================= */
// Teacher checks their own password reset request status
exports.getTeacherPasswordResetStatus = async (req, res) => {
  try {
    const teacherId = req.user?.userId;
    if (!teacherId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication. Please login again.",
      });
    }
    
    const request = await Request.findOne({
      teacherId,
      requestType: "teacher_password_reset"
    }).sort({ createdAt: -1 });

    if (!request) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: request });
  } catch (err) {
    console.error("Get Teacher Password Reset Status Error:", err);
    res.status(500).json({ success: false, message: "Failed to get status" });
  }
};

/* ================= ADMIN: Get All Teacher Password Reset Requests ================= */
// Admin gets all teacher password reset requests
exports.getAllTeacherPasswordResetRequests = async (req, res) => {
  try {
    // Check role - only admin can access
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin only." });
    }

    const requests = await Request.find({ requestType: "teacher_password_reset" })
      .populate("teacherId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("Get All Teacher Password Reset Requests Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch requests" });
  }
};

/* ================= ADMIN: Reset Teacher Password ================= */
// Admin resets teacher's password
exports.resetTeacherPassword = async (req, res) => {
  try {
    // Check role - only admin can access
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin only." });
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

    if (resetRequest.requestType !== "teacher_password_reset") {
      return res.status(400).json({ success: false, message: "Invalid request type" });
    }

    // Find the teacher
    const teacher = await Teacher.findById(resetRequest.teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    teacher.password = hashedPassword;
    
    // Clear any existing reset tokens
    teacher.resetToken = null;
    teacher.resetTokenExpiry = null;
    await teacher.save();

    // Update request status to approved
    resetRequest.status = "approved";
    resetRequest.details = `Password reset by admin on ${new Date().toLocaleString()}`;
    await resetRequest.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Teacher Password Error:", err);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};

/* ================= ADMIN: Reject Teacher Password Reset Request ================= */
// Admin rejects teacher's password reset request
exports.rejectTeacherPasswordResetRequest = async (req, res) => {
  try {
    // Check role - only admin can access
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin only." });
    }

    const { id } = req.params;
    const { rejectReason } = req.body;

    // Find the password reset request
    const resetRequest = await Request.findById(id);
    if (!resetRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (resetRequest.requestType !== "teacher_password_reset") {
      return res.status(400).json({ success: false, message: "Invalid request type" });
    }

    if (resetRequest.status !== "pending") {
      return res.status(400).json({ success: false, message: "Request is not pending" });
    }

    // Update request status to rejected
    resetRequest.status = "rejected";
    resetRequest.details = `Rejected by admin on ${new Date().toLocaleString()}. Reason: ${rejectReason || "Not provided"}`;
    await resetRequest.save();

    res.json({ success: true, message: "Request rejected successfully" });
  } catch (err) {
    console.error("Reject Teacher Password Reset Request Error:", err);
    res.status(500).json({ success: false, message: "Failed to reject request" });
  }
};

/* ================= RESET PASSWORD USING TOKEN ================= */
// Existing functionality - reset password using token
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "Email, token and new password are required" });
    }

    const teacher = await Teacher.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (!teacher) {
      return res.status(404).json({ message: "Invalid request" });
    }

    // Check if token matches and is not expired
    if (!teacher.resetToken || teacher.resetToken !== token) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    if (!teacher.resetTokenExpiry || new Date() > teacher.resetTokenExpiry) {
      return res.status(400).json({ message: "Reset token has expired. Please request a new one." });
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    teacher.password = hashedPassword;
    
    // Clear token fields
    teacher.resetToken = null;
    teacher.resetTokenExpiry = null;
    await teacher.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

