import { NavLink } from 'react-router-dom'

const navItems = [
    { icon: '📊', label: 'Overview', path: '/dashboard', end: true },
    { icon: '🔍', label: 'Discovery', path: '/dashboard/discovery', badge: '3' },
    { icon: '🗺️', label: 'Data Map', path: '/dashboard/datamap' },
    { icon: '✅', label: 'Consent', path: '/dashboard/consent', badge: '12' },
    { icon: '📋', label: 'DSR Queue', path: '/dashboard/dsr', badge: '5' },
    { icon: '🛡️', label: 'Guardrails', path: '/dashboard/guardrails' },
]

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <div className="sidebar-section-label">Main</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span>{item.label}</span>
                        {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                    </NavLink>
                ))}
            </div>

            <div className="sidebar-section">
                <div className="sidebar-section-label">Settings</div>
                <NavLink to="#" className="sidebar-link">
                    <span className="sidebar-icon">⚙️</span>
                    <span>Configuration</span>
                </NavLink>
                <NavLink to="#" className="sidebar-link">
                    <span className="sidebar-icon">🔗</span>
                    <span>Integrations</span>
                </NavLink>
                <NavLink to="#" className="sidebar-link">
                    <span className="sidebar-icon">👥</span>
                    <span>Team</span>
                </NavLink>
            </div>

            <div className="sidebar-footer">
                <div className="sidebar-link" style={{ cursor: 'default' }}>
                    <span className="sidebar-icon">🏢</span>
                    <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Acme Corp</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Data Fiduciary</div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
