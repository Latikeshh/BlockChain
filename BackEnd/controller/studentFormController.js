const StudentForm = require("../models/StudentFormModel");
const Student = require("../models/StudentModel");
const StudentProfile = require("../models/StudentProfileModel");
const { encryptProfile } = require("../utils/blockEncryption");

// student submits/updates their form
exports.submitForm = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const data = req.body;

    // if a photo file was uploaded, store filename
    if (req.file) {
      data.photo = req.file.filename;
    }

    // whenever student resubmits we clear any previous rejection info
    data.rejectNote = null;
    data.rejectSections = {
      basic: false,
      contact: false,
      guardian: false,
      academic: false,
    };

    // upsert form (status reset to pending)
    const form = await StudentForm.findOneAndUpdate(
      { studentId },
      { ...data, status: "pending" },
      { upsert: true, new: true }
    );

    // mark profile locked on student record regardless of verification
    await Student.findByIdAndUpdate(studentId, { isProfileLocked: true });

    res.json({ success: true, data: form });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get current student's form
exports.getMyForm = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const form = await StudentForm.findOne({ studentId });
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });
    res.json({ success: true, data: form });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// teacher / admin: fetch all pending forms
exports.getAllForms = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const forms = await StudentForm.find({ status: "pending" }).populate("studentId", "name enroll").sort({ createdAt: -1 });
    res.json({ success: true, data: forms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// teacher / admin: verify a form (move to blockchain, mark student verified)
exports.verifyForm = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const { id } = req.params; // student id

    const form = await StudentForm.findOne({ studentId: id, status: "pending" });
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found or already processed" });
    }

    // encrypt profile data into blockchain collection
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
    const encryptedHash = encryptProfile(profileData);
    await StudentProfile.create({ studentId: id, hash: encryptedHash });

    // update student verify flag
    const student = await Student.findById(id);
    if (student) {
      student.verify = true;
      await student.save();
    }

    form.status = "verified";
    await form.save();

    res.json({ success: true, message: "Form verified and profile blocked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// teacher / admin: reject a form, optional note
// request body may include `sections` array indicating which areas need updates
exports.rejectForm = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const { id } = req.params;
    const { note, sections = [] } = req.body;

    const form = await StudentForm.findOne({ studentId: id, status: "pending" });
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found or already processed" });
    }

    form.status = "rejected";
    form.rejectNote = note || "";

    // populate rejectSections object with booleans
    const rejects = { basic: false, contact: false, guardian: false, academic: false };
    sections.forEach((s) => {
      if (rejects.hasOwnProperty(s)) {
        rejects[s] = true;
      }
    });
    form.rejectSections = rejects;

    await form.save();

    // unlock the student's profile so they can make edits
    await Student.findByIdAndUpdate(id, { isProfileLocked: false });

    res.json({ success: true, message: "Form rejected", data: form });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
