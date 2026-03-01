const Student = require("../models/StudentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// encryption helper for moving plain forms into blockchain store
const { encryptProfile } = require("../utils/blockEncryption");

// model for encrypted (blockchain) profile documents
const StudentProfile = require("../models/StudentProfileModel");

/* STUDENT SIGNUP */
exports.studentSignup = async (req, res) => {
  const { name, enroll, password } = req.body;

  const exists = await Student.findOne({ enroll, isDeleted: false });
  if (exists) return res.status(400).json({ message: "Student already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  await Student.create({ name, enroll, password: hashedPassword });

  res.status(201).json({ message: "Student signup successful" });
};

/* STUDENT LOGIN */
exports.studentLogin = async (req, res) => {
  const { enroll, password } = req.body;

  const student = await Student.findOne({ enroll, isDeleted: false });
  if (!student) return res.status(404).json({ message: "Student not found" });

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { userId: student._id, role: "student" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Student login successful",
    token,
    user: {
      id: student._id,
      name: student.name,
      enroll: student.enroll,
      role: "student"
    }
  });
};

/* STUDENT COUNT */
exports.countStudents = async (req, res) => {
  const count = await Student.countDocuments({ isDeleted: false });
  res.json({ count });
};

/* GET ALL STUDENTS */
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ isDeleted: false })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* SEARCH STUDENT */
exports.searchStudents = async (req, res) => {
  try {
    const { keyword } = req.query;
    const students = await Student.find({
      isDeleted: false,
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { enroll: { $regex: keyword, $options: "i" } },
      ],
    }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* UPDATE STUDENT */
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, enroll, password } = req.body;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (name) student.name = name;
    if (enroll) student.enroll = enroll;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      student.password = hashedPassword;
    }
    await student.save();
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* VERIFY STUDENT */
exports.verifyStudent = async (req, res) => {
  try {
    // role guard: only teacher or admin may verify
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // if a plain form entry exists, encrypt it into the blockchain store
    const StudentForm = require("../models/StudentFormModel");
    const form = await StudentForm.findOne({ studentId: id, status: "pending" });
    if (form) {
      const profileData = {
        name: form.name,
        enroll: form.enroll,
        branch: form.branch,
        year: form.year,
        dob: form.dob,
        gender: form.gender,
        phone: form.phone,
        email: form.email,
        address: form.address,
        fatherName: form.fatherName,
        motherName: form.motherName,
        parentPhone: form.parentPhone,
        sem1: form.sem1,
        sem2: form.sem2,
        sem3: form.sem3,
        sem4: form.sem4,
        sem5: form.sem5,
        sem6: form.sem6,
        photo: form.photo,
      };
      const enc = encryptProfile(profileData);
      try {
        await StudentProfile.create({ studentId: id, hash: enc });
      } catch (e) {
        // duplicate block already exists - ignore and continue
        if (e.code !== 11000) throw e;
      }
      // Delete the student form after successful verification
      await StudentForm.deleteOne({ studentId: id, status: "pending" });
    }

    // flip verified flag on student record
    student.verify = true;
    await student.save();

    res.json({ message: "Student verified successfully" });
  } catch (err) {
    console.error("verifyStudent error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* UNVERIFY STUDENT */
exports.unverifyStudent = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.verify = false;
    await student.save();

    res.json({ message: "Student unverified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* REJECT STUDENT (send feedback about sections needing modification) */
// this route is called by teacher panel when reviewing a pending student
// it mirrors the behavior of rejecting a form: mark the form as rejected,
// store which sections need changes, save an optional note, and unlock the
// student's profile so they can make updates.
exports.rejectStudent = async (req, res) => {
  try {
    // only teacher or admin may send rejection feedback
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const { sections = [], note } = req.body;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // update the pending form if it exists
    const StudentForm = require("../models/StudentFormModel");
    const form = await StudentForm.findOne({ studentId: id, status: "pending" });
    if (form) {
      form.status = "rejected";
      form.rejectNote = note || "";

      const rejects = { basic: false, contact: false, guardian: false, academic: false };
      sections.forEach((s) => {
        if (rejects.hasOwnProperty(s)) rejects[s] = true;
      });
      form.rejectSections = rejects;
      await form.save();

      // unlock profile so student can edit
      student.isProfileLocked = false;
      await student.save();
    }

    console.log(`Teacher rejected student ${id}, sections:`, sections, "note:", note);

    res.json({ message: "Feedback sent to student", sections, note });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* GET VERIFIED STUDENTS */
exports.getVerifiedStudents = async (req, res) => {
  try {
    const students = await Student.find({ verify: true, isDeleted: false })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL STUDENTS (Admin) ================= */
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isDeleted: false })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET STUDENT BY ID (Admin) ================= */
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, isDeleted: false }).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET STUDENT PROFILE (Admin) ================= */
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, isDeleted: false }).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({
      student: {
        id: student._id,
        name: student.name,
        enroll: student.enroll,
        email: student.email,
        verify: student.verify,
        isProfileLocked: student.isProfileLocked,
        profileLockedAt: student.profileLockedAt,
        createdAt: student.createdAt
      },
      hasProfile: student.isProfileLocked,
      isProfileLocked: student.isProfileLocked
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET PENDING STUDENTS (Admin) ================= */
exports.getPendingStudents = async (req, res) => {
  try {
    const students = await Student.find({ verify: false, isDeleted: false })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE STUDENT (Admin - Soft Delete) ================= */
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET VERIFIED STUDENTS COUNT ================= */
exports.getVerifiedCount = async (req, res) => {
  try {
    const count = await Student.countDocuments({ verify: true, isDeleted: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET PENDING STUDENTS COUNT ================= */
exports.getPendingCount = async (req, res) => {
  try {
    const count = await Student.countDocuments({ verify: false, isDeleted: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
