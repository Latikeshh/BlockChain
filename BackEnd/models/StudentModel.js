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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
