const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/notes — get all notes
router.get('/', async (req, res) => {
    try {
        const [notes] = await db.execute(
            'SELECT * FROM notes ORDER BY updated_at DESC'
        );
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/notes — create a new note
router.post('/', async (req, res) => {
    const { title, content, color } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required.' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO notes (title, content, color) VALUES (?, ?, ?)',
            [title, content || '', color || '#1e1e2e']
        );

        const [newNote] = await db.execute('SELECT * FROM notes WHERE id = ?', [result.insertId]);
        res.status(201).json(newNote[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PUT /api/notes/:id — update a note
router.put('/:id', async (req, res) => {
    const { title, content, color } = req.body;
    const noteId = req.params.id;

    try {
        const [existing] = await db.execute('SELECT id FROM notes WHERE id = ?', [noteId]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Note not found.' });
        }

        await db.execute(
            'UPDATE notes SET title = ?, content = ?, color = ? WHERE id = ?',
            [title, content, color, noteId]
        );

        const [updated] = await db.execute('SELECT * FROM notes WHERE id = ?', [noteId]);
        res.json(updated[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE /api/notes/:id — delete a note
router.delete('/:id', async (req, res) => {
    const noteId = req.params.id;

    try {
        const [existing] = await db.execute('SELECT id FROM notes WHERE id = ?', [noteId]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Note not found.' });
        }

        await db.execute('DELETE FROM notes WHERE id = ?', [noteId]);
        res.json({ message: 'Note deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
