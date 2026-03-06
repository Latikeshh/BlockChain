const TeacherRequest = require("../models/TeacherRequestModel");
const StudentProfile = require("../models/StudentProfileModel");
const StudentForm = require("../models/StudentFormModel");
const Student = require("../models/StudentModel");
const { encryptProfile, decryptProfile } = require("../utils/blockEncryption");

/* ================= STUDENT: Create Request ================= */
exports.createRequest = async (req, res) => {
  try {
    // Validate that userId exists and is valid
    const studentId = req.user?.userId;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication. Please login again.",
      });
    }
    
    const { category, currentData, requestedChange } = req.body;

    if (!category || !currentData || !requestedChange) {
      return res.status(400).json({
        success: false,
        message: "Category, current data, and requested change are required",
      });
    }

    // Get student info
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const newRequest = await TeacherRequest.create({
      studentId,
      studentName: student.name,
      studentEnroll: student.enroll,
      category,
      currentData,
      requestedChange,
    });

    res.status(201).json({ success: true, data: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= STUDENT: Get My Requests ================= */
exports.getMyRequests = async (req, res) => {
  try {
    // Validate that userId exists and is valid
    const studentId = req.user?.userId;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication. Please login again.",
      });
    }
    
    const requests = await TeacherRequest.find({ studentId }).sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= STUDENT: Get Approved Request (for editing) ================= */
exports.getApprovedRequest = async (req, res) => {
  try {
    // Validate that userId exists and is valid
    const studentId = req.user?.userId;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication. Please login again.",
      });
    }
    
    // Find approved requests that haven't been completed yet
    const approvedRequest = await TeacherRequest.findOne({
      studentId,
      status: "approved",
      studentSubmitted: false,
    }).sort({ approvedAt: -1 });

    if (!approvedRequest) {
      return res.status(404).json({
        success: false,
        message: "No approved request found",
      });
    }

    res.json({ success: true, data: approvedRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= STUDENT: Submit Updated Profile ================= */
exports.submitUpdatedProfile = async (req, res) => {
  try {
    // Validate that userId exists and is valid
    const studentId = req.user?.userId;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication. Please login again.",
      });
    }
    
    const { requestId } = req.params;
    const updatedData = req.body;

    // Find the approved request
    const teacherRequest = await TeacherRequest.findOne({
      _id: requestId,
      studentId,
      status: "approved",
      studentSubmitted: false,
    });

    if (!teacherRequest) {
      return res.status(404).json({
        success: false,
        message: "No approved request found or already submitted",
      });
    }

    // Delete old blockchain block permanently
    const deletedBlock = await StudentProfile.findOneAndDelete({ 
      previousHash: studentId.toString() 
    });

    if (deletedBlock) {
      console.log("Old blockchain block deleted for student:", studentId);
    }

    // Also delete any existing StudentForm
    await StudentForm.findOneAndDelete({ studentId });

    // Create new blockchain block with updated data
    const encryptedHash = encryptProfile(updatedData);

    const newBlock = await StudentProfile.create({
      previousHash: studentId.toString(),
      hash: encryptedHash,
    });

    // Update request status to completed
    teacherRequest.studentSubmitted = true;
    teacherRequest.status = "completed";
    await teacherRequest.save();

    res.status(201).json({
      success: true,
      message: "Updated profile submitted successfully. New blockchain block created.",
      blockchain: {
        hash: newBlock.hash,
        previousHash: newBlock.previousHash,
        timestamp: newBlock.timestamp,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= TEACHER: Get All Requests ================= */
exports.getAllRequests = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { status } = req.query;
    let query = {};
    
    if (status && ["pending", "approved", "rejected", "completed"].includes(status)) {
      query.status = status;
    }

    const requests = await TeacherRequest.find(query)
      .populate("studentId", "name enroll")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= TEACHER: Get Request by ID ================= */
exports.getRequestById = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const request = await TeacherRequest.findById(id).populate("studentId", "name enroll");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // Get current student profile data
    let currentProfile = null;
    const block = await StudentProfile.findOne({ previousHash: request.studentId.toString() });
    
    if (block) {
      currentProfile = decryptProfile(block.hash);
    } else {
      const form = await StudentForm.findOne({ studentId: request.studentId });
      if (form) {
        const { status: formStatus, rejectNote, rejectSections, ...plainData } = form.toObject();
        currentProfile = plainData;
      }
    }

    res.json({ success: true, data: request, currentProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= TEACHER: Approve Request ================= */
exports.approveRequest = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const { approvedData } = req.body;

    const teacherRequest = await TeacherRequest.findById(id);
    
    if (!teacherRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (teacherRequest.status !== "pending") {
      return res.status(400).json({ 
        success: false, 
        message: `Request is already ${teacherRequest.status}` 
      });
    }

    // Update request with approval info
    teacherRequest.status = "approved";
    teacherRequest.teacherId = req.user.teacherId || req.user.userId;
    teacherRequest.teacherName = req.user.name || "Teacher";
    teacherRequest.approvedData = approvedData || null;
    teacherRequest.approvedAt = new Date();

    await teacherRequest.save();

    // Unlock the student's profile so they can update their information
    await Student.findByIdAndUpdate(teacherRequest.studentId, { 
      isProfileLocked: false,
      profileLockedAt: null 
    });

    res.json({ 
      success: true, 
      message: "Request approved. Student can now update their profile.",
      data: teacherRequest 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= TEACHER: Reject Request ================= */
exports.rejectRequest = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const { rejectReason } = req.body;

    const teacherRequest = await TeacherRequest.findById(id);
    
    if (!teacherRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (teacherRequest.status !== "pending") {
      return res.status(400).json({ 
        success: false, 
        message: `Request is already ${teacherRequest.status}` 
      });
    }

    teacherRequest.status = "rejected";
    teacherRequest.teacherId = req.user.teacherId || req.user.userId;
    teacherRequest.teacherName = req.user.name || "Teacher";
    teacherRequest.approvedData = rejectReason || "Request rejected";

    await teacherRequest.save();

    res.json({ success: true, message: "Request rejected", data: teacherRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= TEACHER: Get Student Current Data ================= */
exports.getStudentCurrentData = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { studentId } = req.params;

    // Try to get from blockchain first
    let currentProfile = null;
    const block = await StudentProfile.findOne({ previousHash: studentId });
    
    if (block) {
      currentProfile = decryptProfile(block.hash);
    } else {
      // Try StudentForm
      const form = await StudentForm.findOne({ studentId });
      if (form) {
        const { status: formStatus, rejectNote, rejectSections, ...plainData } = form.toObject();
        currentProfile = plainData;
      }
    }

    if (!currentProfile) {
      return res.status(404).json({ 
        success: false, 
        message: "No profile data found for this student" 
      });
    }

    res.json({ success: true, data: currentProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

