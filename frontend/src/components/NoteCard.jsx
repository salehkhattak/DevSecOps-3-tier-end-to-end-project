export default function NoteCard({ note, onEdit, onDelete }) {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    return (
        <div className="note-card" style={{ '--note-color': note.color || '#1e1e2e' }}>
            <div className="note-card-header">
                <h3 className="note-title">{note.title}</h3>
                <div className="note-actions">
                    <button
                        className="btn-icon btn-edit"
                        onClick={() => onEdit(note)}
                        title="Edit note"
                        id={`edit-note-${note.id}`}
                    >
                        ✏️
                    </button>
                    <button
                        className="btn-icon btn-delete"
                        onClick={() => onDelete(note.id)}
                        title="Delete note"
                        id={`delete-note-${note.id}`}
                    >
                        🗑️
                    </button>
                </div>
            </div>
            <p className="note-content">{note.content || 'No additional text...'}</p>
            <div className="note-date">
                <span>🕐 {formatDate(note.updated_at || note.created_at)}</span>
            </div>
        </div>
    )
}
