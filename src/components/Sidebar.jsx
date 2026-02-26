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
        <aside className="sidebar" style={{
            width: '280px',
            background: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border-default)',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
            transition: 'all var(--transition-base)'
        }}>
            <div className="sidebar-header" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: '0 var(--space-2)',
                marginBottom: 'var(--space-2)'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--gradient-accent)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    color: 'white'
                }}>◈</div>
                <span style={{
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.02em'
                }}>Consonant</span>
            </div>

            <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <div style={{
                    fontSize: '0.7rem',
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
                            gap: 'var(--space-3)',
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-md)',
                            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                            background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: isActive ? 600 : 500,
                            transition: 'all var(--transition-base)',
                            border: isActive ? '1px solid var(--border-default)' : '1px solid transparent'
                        })}
                    >
                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {item.badge && (
                            <span style={{
                                background: 'var(--accent-cyan-dim)',
                                color: 'var(--accent-cyan)',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.7rem',
                                fontWeight: 700
                            }}>{item.badge}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-extra" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <div style={{
                    fontSize: '0.7rem',
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
                    gap: 'var(--space-3)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500
                }}>
                    <span>⚙️</span>
                    <span>Settings</span>
                </NavLink>
                <NavLink to="#" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500
                }}>
                    <span>💬</span>
                    <span>Help Center</span>
                </NavLink>
            </div>

            <div className="sidebar-profile" style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-4)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--accent-violet-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem'
                }}>🏢</div>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>Synveritas Corp</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Organization Admin</span>
                </div>
            </div>
        </aside>
    )
}
