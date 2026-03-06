const Block = require("../models/BlockModel");
const StudentForm = require("../models/StudentFormModel");
const { encryptData, decryptData } = require("../utils/encrypt");
const studentFormController = require("./studentFormController");

const saveStudent = async (req, res) => {

    try {

        const studentData = req.body;

        const enroll = studentData.enroll;

        // check duplicate student
        const blocks = await Block.find();

        for (let block of blocks) {

            const existingStudent = decryptData(block.hash);

            if (existingStudent.enroll === enroll) {

                return res.status(400).json({
                    message: "Student Data already saved"
                });

            }
        }

        // encrypt new student data
        const encryptedData = encryptData(studentData);

        // find previous block
        const lastBlock = await Block.findOne().sort({ createdAt: -1 });

        let previousHash = null;

        if (lastBlock) {
            previousHash = lastBlock._id;
        }

        const newBlock = new Block({
            previousHash: previousHash,
            hash: encryptedData
        });

        await newBlock.save();

        res.json({
            message: "Student Data stored in blockchain",
            block: newBlock
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

const getStudent = async (req, res) => {

    try {
        const block = await Block.findById(req.params.id);
        if (!block) {
            return res.status(404).json({
                message: "Block not found"
            });
        }
        const student = decryptData(block.hash);
        res.json(student);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getAllBlocks = async (req, res) => {
    try {
        const blocks = await Block.find().sort({ createdAt: 1 });
        res.json(blocks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getStudentByEnroll = async (req, res) => {

    try {

        const enroll = req.params.enroll;

        const blocks = await Block.find();

        for (let block of blocks) {
            const student = decryptData(block.hash);
            if (student.enroll === enroll) {

                return res.json({
                    blockId: block._id,
                    student: student
                });

            }

        }

        res.status(404).json({
            message: "Student not found in Block Chain"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

const savebydatabase = async (req, res) => {

  try {

    const { studentId } = req.body;

    // Find the student form by studentId (works for both pending and verified status)
    const studentForm = await StudentForm.findOne({ studentId: studentId });

    if (!studentForm) {
      return res.status(404).json({
        message: "Student form not found"
      });
    }

    // prevent duplicate blockchain record by checking if studentId already exists in blocks
    const blocks = await Block.find();

    for (let block of blocks) {

      const existingStudent = decryptData(block.hash);

      if (existingStudent.studentId === studentId) {

        return res.status(400).json({
          message: "Student already stored in blockchain"
        });

      }
    }

    const studentData = studentForm.toObject();
    const enroll = studentForm.enroll; // Store enroll before deleting

    const encryptedData = encryptData(studentData);

    const lastBlock = await Block.findOne().sort({ createdAt: -1 });

    let previousHash = null;

    if (lastBlock) {
      previousHash = lastBlock._id;
    }

    const newBlock = new Block({
      previousHash: previousHash,
      hash: encryptedData
    });

    await newBlock.save();

    // Blockchain storage successful - now call the delete internal function to delete the form by enrollment
    try {
      await studentFormController.deleteFormByEnrollInternal(enroll);
    } catch (deleteError) {
      console.error("Error calling delete function:", deleteError.message);
      // Continue with success response even if delete fails
    }

    res.json({
      message: "Student stored in blockchain and form deleted",
      block: newBlock
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};

module.exports = {
    saveStudent,
    getStudentByEnroll,
    getAllBlocks,
    savebydatabase,
    getStudent
};