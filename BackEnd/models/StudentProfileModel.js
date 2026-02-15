const mongoose = require("mongoose");

const StudentProfileSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
      unique: true,
    },

    /* BASIC INFO */
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    enroll: {
      type: String,
      required: [true, "Enrollment number is required"],
      trim: true,
    },

    branch: {
      type: String,
      required: [true, "Branch is required"],
    },

    year: {
      type: String,
      required: [true, "Year is required"],
    },

    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
    },

    /* CONTACT */
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
    },

    /* GUARDIAN */
    fatherName: {
      type: String,
      required: [true, "Father name is required"],
    },

    motherName: {
      type: String,
      required: [true, "Mother name is required"],
    },

    parentPhone: {
      type: String,
      required: [true, "Parent phone is required"],
    },

    /* ACADEMICS */
    sem1: {
      type: Number,
      required: [true, "Sem 1 marks required"],
      min: 0,
      max: 100,
    },

    sem2: {
      type: Number,
      required: [true, "Sem 2 marks required"],
      min: 0,
      max: 100,
    },

    sem3: {
      type: Number,
      required: [true, "Sem 3 marks required"],
      min: 0,
      max: 100,
    },

    sem4: {
      type: Number,
      required: [true, "Sem 4 marks required"],
      min: 0,
      max: 100,
    },

    sem5: {
      type: Number,
      required: [true, "Sem 5 marks required"],
      min: 0,
      max: 100,
    },

    sem6: {
      type: Number,
      required: [true, "Sem 6 marks required"],
      min: 0,
      max: 100,
    },

    /* PROFILE PHOTO */
    photo: {
      type: String,
      required: [true, "Profile photo is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blocks", StudentProfileSchema);
