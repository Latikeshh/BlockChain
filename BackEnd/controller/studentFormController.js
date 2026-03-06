const StudentForm = require("../models/StudentFormModel");
const Student = require("../models/StudentModel");
const StudentProfile = require("../models/StudentProfileModel");
const StudPermission = require("../models/StudPermissionModel");
const { encryptProfile } = require("../utils/blockEncryption");
const { hasTeacherPermission } = require("../utils/teacherPermissions");

// student submits/updates their form
exports.submitForm = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const incomingData = req.body;

    // if a photo file was uploaded, store filename
    if (req.file) {
      incomingData.photo = req.file.filename;
    }

    const existingForm = await StudentForm.findOne({ studentId }).lean();

    // Merge with existing data to avoid accidentally dropping fields
    // when only a subset is edited (for example semester permission updates).
    const data = {
      ...(existingForm || {}),
      ...incomingData,
      rejectNote: null,
      rejectSections: {
        basic: false,
        contact: false,
        guardian: false,
        academic: false,
      },
      status: "pending",
    };

    // upsert form
    const form = await StudentForm.findOneAndUpdate(
      { studentId },
      data,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // mark profile locked on student record regardless of verification
    await Student.findByIdAndUpdate(studentId, {
      isProfileLocked: true,
      profileLockedAt: new Date(),
    });

    res.json({ success: true, data: form });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// student updates only additional semester data after permission approval
exports.updateStudentForm = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const form = await StudentForm.findOne({ studentId });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Student form not found. Please submit your profile first.",
      });
    }

    const [secondYearPermission, thirdYearPermission] = await Promise.all([
      StudPermission.findOne({ studentId, permissionType: "2nd_year", status: "approved" }),
      StudPermission.findOne({ studentId, permissionType: "3rd_year", status: "approved" }),
    ]);

    const hasValue = (value) => value !== "" && value !== null && value !== undefined;

    const canUpdateSecondYear = !!secondYearPermission && (!hasValue(form.sem3) || !hasValue(form.sem4));
    const canUpdateThirdYear = !!thirdYearPermission && (!hasValue(form.sem5) || !hasValue(form.sem6));

    if (!canUpdateSecondYear && !canUpdateThirdYear) {
      return res.status(403).json({
        success: false,
        message: "No editable semester fields are available for update.",
      });
    }

    const updateData = {};

    if (canUpdateSecondYear) {
      if (req.body.sem3 !== undefined) updateData.sem3 = req.body.sem3;
      if (req.body.sem4 !== undefined) updateData.sem4 = req.body.sem4;
      if (!hasValue(updateData.sem3 ?? form.sem3) || !hasValue(updateData.sem4 ?? form.sem4)) {
        return res.status(400).json({
          success: false,
          message: "Please fill both Semester 3 and Semester 4 marks before submitting.",
        });
      }
      updateData.year = "2nd Year";
    }

    if (canUpdateThirdYear) {
      if (req.body.sem5 !== undefined) updateData.sem5 = req.body.sem5;
      if (req.body.sem6 !== undefined) updateData.sem6 = req.body.sem6;
      if (!hasValue(updateData.sem5 ?? form.sem5) || !hasValue(updateData.sem6 ?? form.sem6)) {
        return res.status(400).json({
          success: false,
          message: "Please fill both Semester 5 and Semester 6 marks before submitting.",
        });
      }
      updateData.year = "3rd Year";
    }

    updateData.status = "pending";
    updateData.rejectNote = null;
    updateData.rejectSections = {
      basic: false,
      contact: false,
      guardian: false,
      academic: false,
    };

    const updatedForm = await StudentForm.findOneAndUpdate(
      { studentId },
      { $set: updateData },
      { new: true }
    );

    await Student.findByIdAndUpdate(studentId, {
      isProfileLocked: true,
      profileLockedAt: new Date(),
    });

    return res.json({
      success: true,
      message: "Semester marks updated successfully.",
      data: updatedForm,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
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
    if (!hasTeacherPermission(req, "pendingStudents")) {
      return res.status(403).json({ success: false, message: "Permission denied for pending students" });
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
    if (!hasTeacherPermission(req, "pendingStudents")) {
      return res.status(403).json({ success: false, message: "Permission denied for pending students" });
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

    // Instead of deleting, mark the form as verified so it can be used later for blockchain storage
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
    if (!hasTeacherPermission(req, "pendingStudents")) {
      return res.status(403).json({ success: false, message: "Permission denied for pending students" });
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

// teacher / admin: delete a student form by enrollment number
exports.deleteFormByEnroll = async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (!hasTeacherPermission(req, "pendingStudents")) {
      return res.status(403).json({ success: false, message: "Permission denied for pending students" });
    }
    
    const { enroll } = req.params;

    const form = await StudentForm.findOne({ enroll: enroll });
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found with this enrollment number" });
    }

    await StudentForm.deleteOne({ enroll: enroll });

    res.json({ success: true, message: "Form deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Internal function for deleting form by enrollment (used by both API and BlockController)
exports.deleteFormByEnrollInternal = async (enroll) => {
  try {
    const form = await StudentForm.findOne({ enroll: enroll });
    if (!form) {
      return { success: false, message: "Form not found with this enrollment number" };
    }

    await StudentForm.deleteOne({ enroll: enroll });

    return { success: true, message: "Form deleted successfully" };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
};
