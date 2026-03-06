const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  // For student requests
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  // For teacher requests
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  // Request type: "student_password_reset", "teacher_password_reset", or "profile_update"
  requestType: {
    type: String,
    enum: ["student_password_reset", "teacher_password_reset", "profile_update"],
    default: "profile_update",
  },
  category: {
    type: String,
  },
  details: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  // Store the name/enrollment for easier display
  requesterName: {
    type: String,
  },
  requesterIdentifier: {
    type: String, // enrollment for students, email for teachers
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Request", RequestSchema);

