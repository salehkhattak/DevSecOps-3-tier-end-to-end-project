export default function Navbar({ search, setSearch }) {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="logo-icon">📝</span>
                <span className="logo-text">Notes</span>
            </div>

            <div className="navbar-search">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                    id="search-input"
                />
            </div>
        </nav>
    )
}
