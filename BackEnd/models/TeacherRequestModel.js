const mongoose = require("mongoose");

const TeacherRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentEnroll: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Basic Information", "Contact Information", "Guardian Details", "Academic Performance", "Other"],
  },
  currentData: {
    type: String,
    required: true,
  },
  requestedChange: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },
  // Teacher who approved the request
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    default: null,
  },
  teacherName: {
    type: String,
    default: null,
  },
  // Store updated data provided by teacher when approving
  approvedData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  // Timestamp when request was approved (allows student to update within timeframe)
  approvedAt: {
    type: Date,
    default: null,
  },
  // Whether student has submitted updated profile
  studentSubmitted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
TeacherRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("TeacherRequest", TeacherRequestSchema);

