const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    enroll: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{11}$/, "Enrollment number must be exactly 11 digits"]
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },
    verify: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    },

    /* ENCRYPTED PROFILE DATA - Stored as encrypted string for decryption on view */
    profileData: {
      type: String,
      default: null
    },

    /* Profile lock status - once profile is saved, it becomes locked */
    isProfileLocked: {
      type: Boolean,
      default: false
    },

    /* Timestamp when profile was locked */
    profileLockedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
