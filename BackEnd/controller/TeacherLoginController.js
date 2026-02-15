const Teacher = require("../models/TeacherModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* TEACHER SIGNUP */
exports.teacherSignup = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await Teacher.findOne({ email, isDeleted: false });
  if (exists) return res.status(400).json({ message: "Teacher already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  await Teacher.create({ name, email, password: hashedPassword });
  res.status(201).json({ message: "Teacher signup successful" });
};

/* TEACHER LOGIN */
exports.teacherLogin = async (req, res) => {
  const { email, password } = req.body;
  const teacher = await Teacher.findOne({ email, isDeleted: false });
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign(
    { userId: teacher._id, role: "teacher" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Teacher login successful",
    token,
    user: {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: "teacher"
    }
  });
};
