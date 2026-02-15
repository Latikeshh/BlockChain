const NoteModel = require('./modal');

// ✅ Create a new note
const createNote = async (req, res) => {
    const { name, message } = req.body;

    try {
        const note = new NoteModel({
            name,
            message,
            email: '',
            password: '',
            address: '',
            isDelete: false
        });
        await note.save();
        res.status(200).send({ message: 'Note created successfully' });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

// ✅ Get all notes (excluding soft-deleted)
const getNotes = async (req, res) => {
    try {
        const notes = await NoteModel.find({ isDelete: { $ne: true } });
        res.status(200).send({ data: notes });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

// ✅ Update a note
const updateNote = async (req, res) => {
    const { name, message } = req.body;
    const { _id } = req.params;

    try {
        const result = await NoteModel.updateOne(
            { _id },
            { $set: { name, message } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({ message: "Note not found" });
        }

        res.status(200).send({
            message: result.modifiedCount > 0
                ? "Note updated successfully"
                : "No changes were made"
        });

    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

// ✅ Soft delete (mark isDelete = true)
const softDeleteNote = async (req, res) => {
    const { _id } = req.params;

    try {
        const result = await NoteModel.updateOne(
            { _id },
            { $set: { isDelete: true } }
        );

        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'Note soft-deleted successfully' });
        } else {
            res.status(404).send({ message: 'Note not found or already deleted' });
        }
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

// ✅ Get a single note by ID
const getNoteById = async (req, res) => {
    const { _id } = req.params;

    try {
        const note = await NoteModel.findById(_id);

        if (!note || note.isDelete) {
            return res.status(404).send({ message: "Note not found" });
        }

        res.status(200).send({ data: note });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
};

// ✅ Hard delete (optional — if you want to remove completely)
const deleteNote = async (req, res) => {
    try {
        const result = await NoteModel.deleteOne({ _id: req.params._id });
        if (result.deletedCount > 0) {
            res.status(200).send({ message: "Note deleted permanently" });
        } else {
            res.status(404).send({ message: "Note not found" });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

module.exports = {
    createNote,
    getNotes,
    updateNote,
    softDeleteNote,
    deleteNote,
    getNoteById  // 👈 Add this
};
