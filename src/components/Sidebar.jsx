import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'

const navItems = [
    { icon: '📊', label: 'Overview', path: '/dashboard', end: true },
    { icon: '🔍', label: 'Discovery', path: '/dashboard/discovery' },
    { icon: '🗺️', label: 'Data Map', path: '/dashboard/datamap' },
    { icon: '✅', label: 'Consent', path: '/dashboard/consent' },
    { icon: '📋', label: 'DSR Queue', path: '/dashboard/dsr' },
    { icon: '🛡️', label: 'Guardrails', path: '/dashboard/guardrails' },
]

export default function Sidebar() {
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
                        <span className="sidebar-org-name">Synveritas Corp</span>
                        <span className="sidebar-org-role">Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
