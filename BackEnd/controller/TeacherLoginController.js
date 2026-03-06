const Teacher = require("../models/TeacherModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DEFAULT_PERMISSIONS = {
  dashboard: true,
  verifiedStudents: true,
  pendingStudents: true,
  changeRequests: true,
  contacts: true,
};

const normalizePermissions = (input) => {
  if (!input || typeof input !== "object") {
    return { ...DEFAULT_PERMISSIONS };
  }

  return {
    dashboard:
      typeof input.dashboard === "boolean"
        ? input.dashboard
        : DEFAULT_PERMISSIONS.dashboard,
    verifiedStudents:
      typeof input.verifiedStudents === "boolean"
        ? input.verifiedStudents
        : DEFAULT_PERMISSIONS.verifiedStudents,
    pendingStudents:
      typeof input.pendingStudents === "boolean"
        ? input.pendingStudents
        : DEFAULT_PERMISSIONS.pendingStudents,
    changeRequests:
      typeof input.changeRequests === "boolean"
        ? input.changeRequests
        : DEFAULT_PERMISSIONS.changeRequests,
    contacts:
      typeof input.contacts === "boolean"
        ? input.contacts
        : DEFAULT_PERMISSIONS.contacts,
  };
};

/* TEACHER SIGNUP */
exports.teacherSignup = async (req, res) => {
  const { name, email, password, permissions } = req.body;

  const exists = await Teacher.findOne({ email, isDeleted: false });
  if (exists) return res.status(400).json({ message: "Teacher already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  await Teacher.create({
    name,
    email,
    password: hashedPassword,
    permissions: normalizePermissions(permissions),
  });
  res.status(201).json({ message: "Teacher signup successful" });
};

/* TEACHER LOGIN */
exports.teacherLogin = async (req, res) => {
  const { email, password } = req.body;
  const teacher = await Teacher.findOne({ email, isDeleted: false });
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  const permissions = normalizePermissions(teacher.permissions);
  const token = jwt.sign(
    { userId: teacher._id, role: "teacher", permissions },
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
      role: "teacher",
      permissions,
    }
  });
};

/* GET ALL TEACHERS */
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({ isDeleted: false })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET TEACHER BY ID */
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select("-password");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE TEACHER */
exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    
    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (password && password.trim()) {
      teacher.password = await bcrypt.hash(password.trim(), 10);
    }
    if (permissions && typeof permissions === "object") {
      teacher.permissions = normalizePermissions(permissions);
    }
    
    await teacher.save();
    res.json({ 
      message: "Teacher updated successfully", 
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        permissions: teacher.permissions,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE TEACHER (Soft Delete) */
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    
    teacher.isDeleted = true;
    await teacher.save();
    
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET TEACHER COUNT */
exports.getTeacherCount = async (req, res) => {
  try {
    const count = await Teacher.countDocuments({ isDeleted: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
