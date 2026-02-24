import { useState, useEffect } from 'react'

const NOTE_COLORS = [
    '#1e1e2e', '#2d1b4e', '#1b2d4e', '#1b4e2d',
    '#4e2d1b', '#4e1b2d', '#2d4e1b', '#3a1e1e',
]

export default function NoteModal({ isOpen, onClose, onSave, editNote }) {
    const [form, setForm] = useState({ title: '', content: '', color: '#1e1e2e' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (editNote) {
            setForm({
                title: editNote.title,
                content: editNote.content || '',
                color: editNote.color || '#1e1e2e',
            })
        } else {
            setForm({ title: '', content: '', color: '#1e1e2e' })
        }
        setError('')
    }, [editNote, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title.trim()) {
            setError('Title is required.')
            return
        }
        setLoading(true)
        try {
            await onSave(form)
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save note.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{editNote ? 'Edit Note' : 'New Note'}</h2>
                    <button className="modal-close" onClick={onClose} id="modal-close-btn">✕</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="note-title">Title</label>
                        <input
                            id="note-title"
                            type="text"
                            placeholder="Note title..."
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="note-content">Content</label>
                        <textarea
                            id="note-content"
                            placeholder="Write your note here..."
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            rows={6}
                        />
                    </div>

                    <div className="form-group">
                        <label>Card Color</label>
                        <div className="color-picker">
                            {NOTE_COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`color-swatch ${form.color === c ? 'selected' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => setForm({ ...form, color: c })}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-ghost" onClick={onClose} id="cancel-note-btn">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading} id="save-note-btn">
                            {loading ? <span className="spinner" /> : (editNote ? 'Save Changes' : 'Create Note')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
