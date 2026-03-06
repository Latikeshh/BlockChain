const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  purpose: { type: String, trim: true },
  message: { type: String, trim: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contact", ContactSchema);
