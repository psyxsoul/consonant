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
        <div className="dashboard-layout" style={{
            display: 'flex',
            height: '100vh',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            transition: 'all var(--transition-base)'
        }}>
            <Sidebar />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Top Bar */}
                <header className="dash-topbar" style={{
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 var(--space-8)',
                    background: 'var(--bg-primary)',
                    borderBottom: '1px solid var(--border-default)',
                    zIndex: 10
                }}>
                    <div className="dash-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                        <div className="dash-topbar-search" style={{
                            background: 'var(--bg-secondary)',
                            padding: '10px 16px',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '320px',
                            border: '1px solid var(--border-subtle)'
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

                    <div className="dash-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                        <ThemeToggle />

                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <button className="topbar-icon-btn" title="Notifications" style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-default)',
                                borderRadius: 'var(--radius-md)',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem',
                                color: 'var(--text-primary)',
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

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-4)',
                            padding: '6px',
                            paddingRight: '16px',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--border-default)',
                            cursor: 'pointer'
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
                                fontSize: '0.85rem'
                            }}>
                                {initials}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name || 'User'}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sign Out</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="dash-main" style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 'var(--space-8)',
                    background: 'var(--bg-primary)'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
