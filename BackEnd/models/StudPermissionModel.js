const mongoose = require("mongoose");

const studPermissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  enrollment: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  // Permission types:
  // "2nd_year" - permission to add sem 3 & sem 4 (for 2nd year)
  // "3rd_year" - permission to add sem 5 & sem 6 (for 3rd year)
  permissionType: {
    type: String,
    enum: ["2nd_year", "3rd_year"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  requestNote: {
    type: String,
    default: "",
  },
  teacherNote: {
    type: String,
    default: "",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
}, { timestamps: true });

// Index to ensure one pending request per student per permission type
studPermissionSchema.index({ studentId: 1, permissionType: 1, status: 1 });

module.exports = mongoose.model("StudPermission", studPermissionSchema);

