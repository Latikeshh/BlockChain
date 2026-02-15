const StudentProfile = require("../models/StudentProfileModel");

/* ================= CREATE OR UPDATE PROFILE ================= */
exports.saveOrUpdateProfile = async (req, res) => {
  try {
    const studentId = req.user.userId; // from JWT middleware

    // Photo check (only required when creating first time)
    let photoName = null;
    if (req.file) {
      photoName = req.file.filename;
    }

    // Prepare data object
    const profileData = {
      studentId,

      /* BASIC INFO */
      name: req.body.name,
      enroll: req.body.enroll,
      branch: req.body.branch,
      year: req.body.year,
      dob: req.body.dob,
      gender: req.body.gender,

      /* CONTACT */
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,

      /* GUARDIAN */
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      parentPhone: req.body.parentPhone,

      /* ACADEMICS */
      sem1: req.body.sem1,
      sem2: req.body.sem2,
      sem3: req.body.sem3,
      sem4: req.body.sem4,
      sem5: req.body.sem5,
      sem6: req.body.sem6,
    };

    // Check if profile exists
    let existingProfile = await StudentProfile.findOne({ studentId });

    /* ================= UPDATE ================= */
    if (existingProfile) {
      if (photoName) {
        profileData.photo = photoName;
      }

      const updated = await StudentProfile.findOneAndUpdate(
        { studentId },
        profileData,
        { new: true, runValidators: true }
      );

      return res.json({
        success: true,
        message: "Profile updated successfully",
        data: updated,
      });
    }

    /* ================= CREATE ================= */
    if (!photoName) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required",
      });
    }

    profileData.photo = photoName;

    const newProfile = await StudentProfile.create(profileData);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: newProfile,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};


/* ================= GET PROFILE ================= */
exports.getMyProfile = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const profile = await StudentProfile.findOne({ studentId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      data: profile,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= DELETE PROFILE ================= */
exports.deleteProfile = async (req, res) => {
  try {
    const studentId = req.user.userId;

    await StudentProfile.findOneAndDelete({ studentId });

    res.json({
      success: true,
      message: "Profile deleted successfully",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
