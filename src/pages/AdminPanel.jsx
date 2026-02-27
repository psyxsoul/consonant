import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminPanel() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/admin/login', { replace: true })
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Admin top bar */}
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-6)',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--accent-red), var(--accent-violet))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 800, color: 'white'
                    }}>◈</div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Consonant Admin</span>
                    <span style={{
                        padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                        background: 'var(--accent-red-dim)', color: 'var(--accent-red)',
                        fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>Super Admin</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</span>
                    <Link to="/" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                        ← Back to Platform
                    </Link>
                    <button className="btn btn-secondary" onClick={handleLogout}
                        style={{ padding: '4px 14px', fontSize: '0.7rem' }}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Admin content */}
            <main style={{ padding: 'var(--space-6) var(--space-8)', maxWidth: '1400px', margin: '0 auto' }}>
                <Outlet />
            </main>
        </div>
    )
}
