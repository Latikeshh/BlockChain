const StudentProfile = require("../models/StudentProfileModel");
const { encryptProfile, decryptProfile } = require("../utils/blockEncryption");

/* ================= CREATE PROFILE ================= */
// When a student submits their profile this handler encrypts the entire
// payload and writes it as a "block" in the studentprofiles collection.  No
// unencrypted profile data is ever stored in the students document; the only
// field we later update on verify is the `verify` flag in that separate
// collection.  This mirrors a simple blockchain where each block contains a
// hash of the previous one, ensuring immutability.
exports.saveProfile = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const existingProfile = await StudentProfile.findOne({ studentId });

    if (existingProfile) {
      return res.status(403).json({
        success: false,
        message:
          "Profile already saved. Blockchain records cannot be modified. Contact admin.",
      });
    }

    let photoName = null;
    if (req.file) {
      photoName = req.file.filename;
    }

    const profileData = {
      name: req.body.name,
      enroll: req.body.enroll,
      branch: req.body.branch,
      year: req.body.year,
      dob: req.body.dob,
      gender: req.body.gender,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      parentPhone: req.body.parentPhone,
      sem1: req.body.sem1,
      sem2: req.body.sem2,
      sem3: req.body.sem3,
      sem4: req.body.sem4,
      sem5: req.body.sem5,
      sem6: req.body.sem6,
      photo: photoName,
    };

    const encryptedHash = encryptProfile(profileData);

    const newBlock = await StudentProfile.create({
      studentId,
      hash: encryptedHash,
      previousHash: "0",
      blockNumber: 1,
    });

    res.status(201).json({
      success: true,
      message: "Profile stored as blockchain block",
      blockchain: {
        blockNumber: newBlock.blockNumber,
        hash: newBlock.hash,
        previousHash: newBlock.previousHash,
      },
      data: profileData,
      isProfileLocked: true,
      hasProfile: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET PROFILE ================= */
exports.getMyProfile = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const block = await StudentProfile.findOne({ studentId });

    // also fetch basic student record to know verification status
    const Student = require('../models/StudentModel');
    const studentRecord = await Student.findById(studentId).select('verify name enroll');

    if (block) {
      const decryptedProfile = decryptProfile(block.hash);

      return res.json({
        success: true,
        blockchain: {
          blockNumber: block.blockNumber,
          hash: block.hash,
          previousHash: block.previousHash,
        },
        data: decryptedProfile,
        isProfileLocked: true,
        hasProfile: true,
        verify: studentRecord ? studentRecord.verify : false,
        name: studentRecord?.name,
        enroll: studentRecord?.enroll
      });
    }

    // no encrypted block yet – check for plain form submission
    const StudentForm = require('../models/StudentFormModel');
    const form = await StudentForm.findOne({ studentId });
    if (form) {
      const { status, rejectNote, rejectSections, ...plain } = form.toObject();
      // if form was rejected, allow student to edit again by unlocking
      const locked = status !== "rejected";
      return res.json({
        success: true,
        data: plain,
        status,
        rejectNote,
        rejectSections,
        hasProfile: true,
        isProfileLocked: locked,
        verify: studentRecord ? studentRecord.verify : false,
        name: studentRecord?.name,
        enroll: studentRecord?.enroll
      });
    }

    // otherwise no profile or form exists
    return res.status(200).json({
      success: true,
      hasProfile: false,
      isProfileLocked: false,
      verify: studentRecord ? studentRecord.verify : false,
      name: studentRecord?.name,
      enroll: studentRecord?.enroll
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
/* ================= GET PROFILE BY ID (FOR VERIFY) ================= */
exports.getProfileById = async (req, res) => {
  try {
    const { studentId } = req.params; // get id from URL
    const block = await StudentProfile.findOne({ studentId });

    if (block) {
      // decrypt blockchain data
      const decryptedProfile = decryptProfile(block.hash);
      return res.json({
        success: true,
        blockchain: {
          blockNumber: block.blockNumber,
          hash: block.hash,
          previousHash: block.previousHash,
        },
        data: decryptedProfile,
        isProfileLocked: true,
        hasProfile: true,
      });
    }

    // if no block exists yet, try to return the plain form (pre‑verification)
    const StudentForm = require("../models/StudentFormModel");
    const form = await StudentForm.findOne({ studentId });
    if (form) {
      // send the unencrypted values directly
      const { status, rejectNote, rejectSections, ...plain } = form.toObject();
      // if form was rejected, unlock for editing (teacher might inspect the rejection status)
      const locked = status !== "rejected";
      return res.json({
        success: true,
        data: plain,
        status,
        rejectNote,
        rejectSections,
        isProfileLocked: locked,
        hasProfile: true,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Student profile not found",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= DELETE PROFILE ================= */
exports.deleteProfile = async (req, res) => {
  try {
    const studentId = req.user.userId;

    await StudentProfile.findOneAndDelete({ studentId });

    res.json({
      success: true,
      message: "Blockchain block deleted",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};