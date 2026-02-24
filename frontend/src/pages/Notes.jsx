import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import NoteModal from '../components/NoteModal'
import api from '../api/axios'

export default function Notes() {
    const [notes, setNotes] = useState([])
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editNote, setEditNote] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const fetchNotes = useCallback(async () => {
        try {
            const { data } = await api.get('/notes')
            setNotes(data)
        } catch (err) {
            console.error('Failed to fetch notes:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchNotes()
    }, [fetchNotes])

    const handleSave = async (form) => {
        if (editNote) {
            const { data } = await api.put(`/notes/${editNote.id}`, form)
            setNotes((prev) => prev.map((n) => (n.id === editNote.id ? data : n)))
        } else {
            const { data } = await api.post('/notes', form)
            setNotes((prev) => [data, ...prev])
        }
        setEditNote(null)
    }

    const handleEdit = (note) => {
        setEditNote(note)
        setModalOpen(true)
    }

    const handleDelete = (id) => {
        setDeleteConfirm(id)
    }

    const confirmDelete = async () => {
        try {
            await api.delete(`/notes/${deleteConfirm}`)
            setNotes((prev) => prev.filter((n) => n.id !== deleteConfirm))
        } catch (err) {
            console.error('Delete failed:', err)
        } finally {
            setDeleteConfirm(null)
        }
    }

    const openCreate = () => {
        setEditNote(null)
        setModalOpen(true)
    }

    const filtered = notes.filter(
        (n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            (n.content && n.content.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="notes-page">
            <Navbar search={search} setSearch={setSearch} />

            <main className="notes-main">
                <div className="notes-header">
                    <div>
                        <h2 className="notes-heading">My Notes</h2>
                        <p className="notes-count">{filtered.length} note{filtered.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button className="btn btn-primary btn-add" onClick={openCreate} id="add-note-btn">
                        <span>+</span> New Note
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner large" />
                        <p>Loading your notes...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🗒️</span>
                        <h3>{search ? 'No notes match your search' : 'No notes yet'}</h3>
                        <p>{search ? 'Try a different keyword' : 'Click "New Note" to get started!'}</p>
                    </div>
                ) : (
                    <div className="notes-grid">
                        {filtered.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            <NoteModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditNote(null) }}
                onSave={handleSave}
                editNote={editNote}
            />

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete Note?</h3>
                        <p>This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)} id="cancel-delete-btn">
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={confirmDelete} id="confirm-delete-btn">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
