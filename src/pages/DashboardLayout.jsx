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
        <div className="dashboard-container">
            <Sidebar />

            <div className="dash-main-wrapper">
                <header className="dash-topbar">
                    <div className="topbar-search">
                        <span style={{ fontSize: '1rem', opacity: 0.6 }}>🔍</span>
                        <input type="text" placeholder="Search everything..." />
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <button className="btn-ghost flex-center" title="Notifications" style={{
                            width: '38px', height: '38px', fontSize: '1.1rem', position: 'relative',
                            background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-subtle)', cursor: 'pointer'
                        }}>
                            🔔
                            <span style={{
                                position: 'absolute', top: '6px', right: '6px',
                                width: '7px', height: '7px', background: 'var(--accent-cyan)',
                                borderRadius: '50%', border: '2px solid var(--bg-primary)'
                            }} />
                        </button>

                        <div className="topbar-user-pill" onClick={logout}>
                            <div className="topbar-avatar">{initials}</div>
                            <div className="flex-col">
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.name || 'User'}</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Sign Out</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="dash-main">
                    <div className="dash-content-inner animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
