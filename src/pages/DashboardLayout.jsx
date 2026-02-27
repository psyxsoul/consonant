import { Outlet, Link } from 'react-router-dom'
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
                {/* Top Bar */}
                <header className="dash-topbar">
                    <div className="dash-topbar-left flex items-center gap-8">
                        <div className="dash-topbar-search" style={{
                            background: 'var(--bg-secondary)',
                            padding: '10px 16px',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '320px',
                            border: '1px solid var(--border-subtle)',
                            transition: 'all var(--transition-base)'
                        }}>
                            <span style={{ fontSize: '1.1rem', opacity: 0.6 }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search everything..."
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'var(--text-primary)',
                                    width: '100%',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>

                    <div className="dash-topbar-right flex items-center gap-6">
                        <ThemeToggle />

                        <div className="flex gap-2">
                            <button className="btn-ghost flex items-center justify-center p-0" title="Notifications" style={{
                                width: '40px',
                                height: '40px',
                                fontSize: '1.2rem',
                                position: 'relative'
                            }}>
                                🔔
                                <span style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    width: '8px',
                                    height: '8px',
                                    background: 'var(--accent-cyan)',
                                    borderRadius: '50%',
                                    border: '2px solid var(--bg-primary)'
                                }} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 py-1 px-1 pr-4" style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--border-default)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-base)'
                        }} onClick={logout}>
                            <div className="topbar-avatar" style={{
                                width: '36px',
                                height: '36px',
                                background: 'var(--gradient-accent)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                color: 'white',
                                fontSize: '0.85rem',
                                boxShadow: '0 4px 10px rgba(0, 212, 255, 0.2)'
                            }}>
                                {initials}
                            </div>
                            <div className="flex-col">
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name || 'User'}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sign Out</span>
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
