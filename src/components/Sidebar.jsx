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
        <aside className="sidebar flex-col gap-8 p-6">
            <div className="sidebar-header flex items-center gap-3 px-2 mb-4">
                <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'var(--gradient-accent)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)'
                }}>◈</div>
                <span style={{
                    fontWeight: 800,
                    fontSize: '1.35rem',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)'
                }}>Consonant</span>
            </div>

            <nav className="flex-col gap-2">
                <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--text-muted)',
                    padding: '0 var(--space-3)',
                    marginBottom: 'var(--space-2)'
                }}>Main Platform</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-4)',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                            background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: isActive ? 600 : 500,
                            transition: 'all var(--transition-base)',
                            border: isActive ? '1px solid var(--accent-cyan-dim)' : '1px solid transparent',
                            boxShadow: isActive ? 'inset 4px 0 0 var(--accent-cyan)' : 'none'
                        })}
                    >
                        <span style={{ fontSize: '1.2rem', opacity: 0.9 }}>{item.icon}</span>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {item.badge && (
                            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{item.badge}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto flex-col gap-2">
                <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--text-muted)',
                    padding: '0 var(--space-3)',
                    marginBottom: 'var(--space-2)'
                }}>Support</div>
                <NavLink to="#" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    transition: 'all var(--transition-base)'
                }}>
                    <span style={{ fontSize: '1.1rem' }}>⚙️</span>
                    <span>Settings</span>
                </NavLink>
                <NavLink to="#" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    transition: 'all var(--transition-base)'
                }}>
                    <span style={{ fontSize: '1.1rem' }}>💬</span>
                    <span>Help Center</span>
                </NavLink>
            </div>

            <div className="sidebar-profile mt-4 p-4 flex items-center gap-3" style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                transition: 'all var(--transition-base)',
                cursor: 'pointer'
            }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-violet)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}>
                <div style={{
                    minWidth: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-violet-dim)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem'
                }}>🏢</div>
                <div className="flex-col" style={{ overflow: 'hidden' }}>
                    <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>Synveritas Corp</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Organization Admin</span>
                </div>
            </div>
        </aside>
    )
}
