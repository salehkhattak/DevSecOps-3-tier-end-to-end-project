const express = require('express');
const cors = require('cors');
require('dotenv').config();

const notesRoutes = require('./routes/notes');

const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/notes', notesRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Notes App API is running 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
