const mongoose = require("mongoose");

const StudentProfileSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },

    // 🔐 Encrypted full profile JSON stored here
    hash: {
      type: String,
      required: true,
    },

    // Blockchain-style fields
    previousHash: {
      type: String,
      default: "0",
    },

    blockNumber: {
      type: Number,
      default: 1,
    },
  },
);

module.exports = mongoose.model("Blocks", StudentProfileSchema);