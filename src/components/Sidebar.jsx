import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
    { icon: '📊', label: 'Overview', path: '/dashboard', end: true },
    { icon: '🔍', label: 'Discovery', path: '/dashboard/discovery' },
    { icon: '🗺️', label: 'Data Map', path: '/dashboard/datamap' },
    { icon: '✅', label: 'Consent', path: '/dashboard/consent' },
    { icon: '📋', label: 'DSR Queue', path: '/dashboard/dsr' },
    { icon: '🛡️', label: 'Guardrails', path: '/dashboard/guardrails' },
]

const adminItems = [
    { icon: '🔌', label: 'Connectors', path: '/dashboard/connectors' },
    { icon: '📜', label: 'Audit Trail', path: '/dashboard/audit' },
]

export default function Sidebar() {
    const { user, isAdmin } = useAuth()

    return (
        <aside className="sidebar">
            {/* Logo */}
            <Link to="/" className="sidebar-logo">
                <div className="sidebar-logo-icon">◈</div>
                <span className="sidebar-logo-text">Consonant</span>
            </Link>

            {/* Navigation */}
            <div className="sidebar-section">
                <div className="sidebar-section-label">Platform</div>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="sidebar-link-icon">{item.icon}</span>
                            <span className="sidebar-link-text">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Admin-only section */}
                {isAdmin && (
                    <>
                        <div className="sidebar-section-label" style={{ marginTop: 'var(--space-6)' }}>Security</div>
                        <nav className="sidebar-nav">
                            {adminItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                                >
                                    <span className="sidebar-link-icon">{item.icon}</span>
                                    <span className="sidebar-link-text">{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>
                    </>
                )}
            </div>

            {/* Bottom section */}
            <div className="sidebar-bottom">
                <div className="sidebar-section-label">Support</div>
                <NavLink to="#" className="sidebar-link">
                    <span className="sidebar-link-icon">⚙️</span>
                    <span className="sidebar-link-text">Settings</span>
                </NavLink>
                <NavLink to="#" className="sidebar-link">
                    <span className="sidebar-link-icon">💬</span>
                    <span className="sidebar-link-text">Help</span>
                </NavLink>

                <div className="sidebar-org">
                    <div className="sidebar-org-icon">🏢</div>
                    <div className="sidebar-org-info">
                        <span className="sidebar-org-name">{user?.organization || 'Synveritas Corp'}</span>
                        <span className="sidebar-org-role" style={{
                            background: user?.role === 'owner' ? 'var(--accent-violet-dim)' : 'var(--bg-tertiary)',
                            color: user?.role === 'owner' ? 'var(--accent-violet)' : 'var(--text-muted)',
                            padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>
                            {user?.role || 'Admin'}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
