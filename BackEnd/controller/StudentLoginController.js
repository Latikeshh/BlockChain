const Student = require("../models/StudentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.verify = true;
    await student.save();

    res.json({ message: "Student verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* UNVERIFY STUDENT */
exports.unverifyStudent = async (req, res) => {
  try {
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
