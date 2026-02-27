import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import ThemeToggle from '../components/ThemeToggle'

export default function DashboardLayout() {
    const { user, logout } = useAuth()

    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U'

    return (
        <div className="dash-shell">
            <Sidebar />
            <div className="dash-body">
                <header className="dash-topbar">
                    <div className="dash-search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                        </svg>
                        <input type="text" placeholder="Search..." />
                        <kbd className="dash-search-kbd">⌘K</kbd>
                    </div>

                    <div className="dash-topbar-actions">
                        <ThemeToggle />
                        <button className="dash-icon-btn" title="Notifications">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                            <span className="dash-notif-dot" />
                        </button>
                        <div className="dash-user" onClick={logout} title="Sign Out">
                            <div className="dash-avatar">{initials}</div>
                            <span className="dash-user-name">{user?.name || 'User'}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.4 }}>
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </div>
                    </div>
                </header>

                <main className="dash-content">
                    <div className="dash-content-inner">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
