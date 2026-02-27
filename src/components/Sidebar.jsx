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
        <aside className="sidebar" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div className="flex items-center gap-3" style={{ padding: '0 var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <div style={{
                    width: '34px', height: '34px', background: 'var(--gradient-accent)',
                    borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', color: 'white', boxShadow: '0 4px 12px rgba(0,212,255,0.3)'
                }}>◈</div>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>Consonant</span>
            </div>

            <nav className="flex-col gap-2">
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '0 var(--space-3)', marginBottom: 'var(--space-1)' }}>
                    Main Platform
                </div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {item.badge && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{item.badge}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto flex-col gap-2">
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '0 var(--space-3)', marginBottom: 'var(--space-1)' }}>
                    Support
                </div>
                <NavLink to="#" className="sidebar-link">
                    <span style={{ fontSize: '1rem' }}>⚙️</span>
                    <span>Settings</span>
                </NavLink>
                <NavLink to="#" className="sidebar-link">
                    <span style={{ fontSize: '1rem' }}>💬</span>
                    <span>Help Center</span>
                </NavLink>
            </div>

            <div className="flex items-center gap-3 p-4" style={{
                background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)', cursor: 'pointer'
            }}>
                <div className="flex-center" style={{
                    minWidth: '34px', height: '34px', borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-violet-dim)', border: '1px solid rgba(139,92,246,0.3)',
                    fontSize: '1rem'
                }}>🏢</div>
                <div className="flex-col" style={{ overflow: 'hidden' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Synveritas Corp</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Organization Admin</span>
                </div>
            </div>
        </aside>
    )
}
