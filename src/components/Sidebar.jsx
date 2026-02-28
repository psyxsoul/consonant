import { useState, useEffect } from 'react'
import { NavLink, Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Nav items with their required feature key
const navItems = [
    { icon: '📊', label: 'Overview', path: '', end: true },
    { icon: '🔍', label: 'Discovery', path: '/discovery', feature: 'discovery' },
    { icon: '🗺️', label: 'Data Map', path: '/datamap', feature: 'datamap' },
    { icon: '✅', label: 'Consent', path: '/consent', feature: 'consent' },
    { icon: '📋', label: 'DSR Queue', path: '/dsr', feature: 'dsr' },
    { icon: '🛡️', label: 'Guardrails', path: '/guardrails', feature: 'guardrails' },
    { icon: '🧠', label: 'Vera AI', path: '/copilot', feature: 'vera' },
    { icon: '🔥', label: 'LLM Firewall', path: '/firewall', feature: 'firewall' },
]

const adminItems = [
    { icon: '🔌', label: 'Connectors', path: '/connectors', feature: 'connectors' },
    { icon: '📜', label: 'Audit Trail', path: '/audit', feature: 'audit' },
]

export default function Sidebar() {
    const { user, isAdmin, isSuperAdmin, hasFeature } = useAuth()
    const { slug } = useParams()

    const [collapsed, setCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebar_collapsed')
        return saved === 'true'
    })

    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', collapsed)
    }, [collapsed])

    // Build the base path — slug-based or legacy
    const basePath = slug ? `/${slug}/dashboard` : '/dashboard'

    const roleColor = {
        super_admin: { bg: 'var(--accent-red-dim)', color: 'var(--accent-red)' },
        owner: { bg: 'var(--accent-violet-dim)', color: 'var(--accent-violet)' },
        admin: { bg: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)' },
    }
    const role = roleColor[user?.role] || { bg: 'var(--bg-tertiary)', color: 'var(--text-muted)' }

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <button
                className="sidebar-toggle"
                onClick={() => setCollapsed(!collapsed)}
                title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {collapsed ? '→' : '←'}
            </button>

            <Link to="/" className="sidebar-logo" title={collapsed ? "Consonant" : undefined}>
                <div className="sidebar-logo-icon">◈</div>
                <span className="sidebar-logo-text">Consonant</span>
            </Link>

            <hr className="sidebar-divider" />

            <div className="sidebar-section">
                <div className="sidebar-section-label">Platform</div>
                <nav className="sidebar-nav">
                    {navItems.filter(item => !item.feature || hasFeature(item.feature)).map(item => (
                        <NavLink key={item.path} to={`${basePath}${item.path}`} end={item.end}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            title={collapsed ? item.label : undefined}>
                            <span className="sidebar-link-icon">{item.icon}</span>
                            <span className="sidebar-link-text">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {isAdmin && (
                    <>
                        <div className="sidebar-section-label" style={{ marginTop: 'var(--space-6)' }}>Administration</div>
                        <nav className="sidebar-nav">
                            {adminItems.filter(item => !item.feature || hasFeature(item.feature)).map(item => (
                                <NavLink key={item.path} to={`${basePath}${item.path}`}
                                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                                    title={collapsed ? item.label : undefined}>
                                    <span className="sidebar-link-icon">{item.icon}</span>
                                    <span className="sidebar-link-text">{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>
                    </>
                )}
            </div>

            <hr className="sidebar-divider" />

            <div className="sidebar-bottom">
                <div className="sidebar-section-label">Support</div>
                <NavLink to="#" className="sidebar-link" title={collapsed ? "Settings" : undefined}>
                    <span className="sidebar-link-icon">⚙️</span>
                    <span className="sidebar-link-text">Settings</span>
                </NavLink>
                <NavLink to="#" className="sidebar-link" title={collapsed ? "Help" : undefined}>
                    <span className="sidebar-link-icon">💬</span>
                    <span className="sidebar-link-text">Help</span>
                </NavLink>

                <div className="sidebar-org" title={collapsed ? (user?.organization || 'Synveritas Corp') : undefined}>
                    <div className="sidebar-org-icon">🏢</div>
                    <div className="sidebar-org-info">
                        <span className="sidebar-org-name">{user?.organization || 'Synveritas Corp'}</span>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                            <span className="sidebar-org-role" style={{
                                background: role.bg, color: role.color,
                                padding: '1px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem',
                                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                                {user?.role?.replace('_', ' ') || 'Admin'}
                            </span>
                            {slug && (
                                <span style={{
                                    fontSize: '0.6rem', color: 'var(--text-muted)',
                                    fontFamily: 'var(--font-mono)'
                                }}>
                                    /{slug}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
