const mongoose = require("mongoose");

const StudentFormSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    name: { type: String, trim: true },
    enroll: { type: String, trim: true },
    branch: { type: String, trim: true },
    year: { type: String, trim: true },
    dob: { type: String, trim: true },
    gender: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    parentPhone: { type: String, trim: true },
    sem1: { type: String, trim: true },
    sem2: { type: String, trim: true },
    sem3: { type: String, trim: true },
    sem4: { type: String, trim: true },
    sem5: { type: String, trim: true },
    sem6: { type: String, trim: true },
    photo: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    rejectNote: { type: String, trim: true, default: null },
    // track which sections were marked for revision by teacher
    rejectSections: {
      basic: { type: Boolean, default: false },
      contact: { type: Boolean, default: false },
      guardian: { type: Boolean, default: false },
      academic: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentForm", StudentFormSchema);
