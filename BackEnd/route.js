const express = require('express');
const router = express.Router();
const Controller = require('./Controller');

// Create a new note
router.post('/createnote', Controller.createNote);

// Get all notes
router.get('/getnotes', Controller.getNotes);

// ✅ FIXED: Use GET for fetching a single note
router.get('/getnote/:_id', Controller.getNoteById);

// Update a note
router.put('/updatenote/:_id', Controller.updateNote);

// Soft delete (mark as deleted)
router.put('/deletenote/:_id', Controller.softDeleteNote);

// Hard delete (permanently remove)
router.delete('/harddelete/:_id', Controller.deleteNote);

module.exports = router;
