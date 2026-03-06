const StudPermission = require("../models/StudPermissionModel");
const Student = require("../models/StudentModel");

/* ================= REQUEST PERMISSION ================= */
exports.requestPermission = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { permissionType, requestNote } = req.body;

    // Validate permission type
    if (!["2nd_year", "3rd_year"].includes(permissionType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid permission type",
      });
    }

    // Get student details
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if there's already a pending request for this permission type
    const existingRequest = await StudPermission.findOne({
      studentId,
      permissionType,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request for this permission",
      });
    }

    // Check if permission was already approved
    const approvedRequest = await StudPermission.findOne({
      studentId,
      permissionType,
      status: "approved",
    });

    if (approvedRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have permission for this",
        permission: approvedRequest,
      });
    }

    // Create new permission request
    const newPermission = await StudPermission.create({
      studentId,
      enrollment: student.enroll,
      studentName: student.name,
      permissionType,
      requestNote: requestNote || "",
    });

    res.status(201).json({
      success: true,
      message: "Permission request submitted successfully",
      permission: newPermission,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET MY PERMISSIONS ================= */
exports.getMyPermissions = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const permissions = await StudPermission.find({ studentId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      permissions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET PERMISSION STATUS ================= */
exports.getPermissionStatus = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { permissionType } = req.params;

    // Validate permission type
    if (!["2nd_year", "3rd_year"].includes(permissionType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid permission type",
      });
    }

    // Get the latest request for this permission type
    const permission = await StudPermission.findOne({
      studentId,
      permissionType,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      permission,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= TEACHER: GET ALL PENDING PERMISSIONS ================= */
exports.getAllPendingPermissions = async (req, res) => {
  try {
    const permissions = await StudPermission.find({ status: "pending" })
      .populate("studentId", "name email enroll")
      .sort({ createdAt: -1 });

    // Map to add studentName and studentEnroll for frontend compatibility
    const mappedPermissions = permissions.map(perm => ({
      _id: perm._id,
      studentId: perm.studentId?._id,
      studentName: perm.studentName || perm.studentId?.name,
      studentEnroll: perm.enrollment || perm.studentId?.enroll,
      permissionType: perm.permissionType,
      status: perm.status,
      requestNote: perm.requestNote,
      teacherNote: perm.teacherNote,
      createdAt: perm.createdAt,
      updatedAt: perm.updatedAt
    }));

    res.json({
      success: true,
      permissions: mappedPermissions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= TEACHER: APPROVE/REJECT PERMISSION ================= */
exports.respondToPermission = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const { status, teacherNote } = req.body;
    const teacherId = req.user.userId;

    // Validate status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'approved' or 'rejected'",
      });
    }

    const permission = await StudPermission.findById(permissionId);

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission request not found",
      });
    }

    if (permission.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been responded to",
      });
    }

    // Update permission
    permission.status = status;
    permission.teacherNote = teacherNote || "";
    permission.respondedAt = new Date();
    permission.respondedBy = teacherId;

    await permission.save();

    res.json({
      success: true,
      message: `Permission ${status} successfully`,
      permission,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= TEACHER: GET ALL PERMISSIONS (HISTORY) ================= */
exports.getAllPermissions = async (req, res) => {
  try {
    const { status, permissionType } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (permissionType) {
      query.permissionType = permissionType;
    }

    const permissions = await StudPermission.find(query)
      .populate("studentId", "name email enroll")
      .populate("respondedBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      permissions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

