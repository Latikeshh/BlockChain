const mongoose = require("mongoose");

const teacherPermissionsSchema = new mongoose.Schema(
  {
    dashboard: { type: Boolean, default: true },
    verifiedStudents: { type: Boolean, default: true },
    pendingStudents: { type: Boolean, default: true },
    changeRequests: { type: Boolean, default: true },
    contacts: { type: Boolean, default: true },
  },
  { _id: false }
);

const TeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },

    password: {
      type: String,
      required: true
    },

    permissions: {
      type: teacherPermissionsSchema,
      default: () => ({
        dashboard: true,
        verifiedStudents: true,
        pendingStudents: true,
        changeRequests: true,
        contacts: true,
      }),
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
