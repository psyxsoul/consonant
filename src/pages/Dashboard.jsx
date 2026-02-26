import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import api from '../services/api'

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        Promise.all([api.getDashboardStats(), api.getActivity()])
            .then(([s, a]) => { setStats(s); setActivities(a) })
            .catch(err => { console.error(err); setError(err.message) })
            .finally(() => setLoading(false))
    }, [])

    const quickActions = [
        { icon: '🔍', label: 'Discovery Scan', desc: 'AI scan for PII in your data', color: 'var(--accent-cyan)', path: '/dashboard/discovery' },
        { icon: '📝', label: 'Consent Notice', desc: 'Create a DPDPA record', color: 'var(--accent-violet)', path: '/dashboard/consent' },
        { icon: '📋', label: 'Process DSR', desc: 'Log a new subject request', color: 'var(--accent-amber)', path: '/dashboard/dsr' },
        { icon: '🛡️', label: 'Guardrails', desc: 'Manage active defenses', color: 'var(--accent-green)', path: '/dashboard/guardrails' },
    ]

    if (loading) return (
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-cyan-dim)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', animation: 'rotate 1s linear infinite', margin: '0 auto 16px' }} />
                <span>Harmonizing privacy data...</span>
            </div>
        </div>
    )

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="page-header" style={{ marginBottom: 'var(--space-10)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Privacy <span className="text-gradient">Overview</span></h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Real-time posture monitoring and compliance intelligence.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/dashboard/discovery')}>
                    🚀 Trigger AI Scan
                </button>
            </div>

            <div className="grid-4" style={{ marginBottom: 'var(--space-10)' }}>
                <StatCard icon="📦" value={stats?.total_assets?.toLocaleString() || '0'} label="Assets Tracked" trend="+12.4%" />
                <StatCard icon="✅" value={`${stats?.consent_coverage || 0}%`} label="Consent Coverage" trend="+1.8%" />
                <StatCard icon="📋" value={stats?.open_dsrs || 0} label="Active DSRs" trend="-3" />
                <StatCard icon="⚠️" value={stats?.active_risks || 0} label="Critical Risks" trend="-2" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-8)' }}>
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Recent Platform Activity</h3>
                        <span className="badge badge-green">● Live Update</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {activities.map((a, i) => (
                            <div key={a.id || i} style={{
                                padding: '16px 24px',
                                borderBottom: i < activities.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'flex-start'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: `var(--accent-${a.color || 'cyan'}-dim)`,
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    marginTop: '2px'
                                }}>
                                    {a.color === 'red' ? '🚨' : a.color === 'amber' ? '⚠️' : 'ℹ️'}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '4px' }}>{a.message}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(a.timestamp).toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                        {activities.length === 0 && (
                            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
                                No recent activity detected.
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-6)' }}>Intelligent Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {quickActions.map((qa, i) => (
                                <div key={i} onClick={() => navigate(qa.path)} style={{
                                    padding: '12px 16px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-default)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-base)'
                                }} className="dashboard-action">
                                    <span style={{ fontSize: '1.2rem' }}>{qa.icon}</span>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{qa.label}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{qa.desc}</div>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>→</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ background: 'var(--gradient-card)', border: '1px solid var(--accent-cyan-dim)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ fontSize: '1rem' }}>DPDPA Health</h3>
                            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>Automated Assessment</span>
                        </div>
                        <div style={{ textAlign: 'center', padding: 'var(--space-2) 0' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 800 }} className="text-gradient">
                                {stats?.consent_coverage || 0}%
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Compliance readiness score</p>
                        </div>
                        <div style={{
                            height: '8px',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-full)',
                            marginTop: '20px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${stats?.consent_coverage || 0}%`,
                                height: '100%',
                                background: 'var(--gradient-accent)',
                                borderRadius: 'var(--radius-full)',
                                boxShadow: '0 0 15px var(--accent-cyan)'
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
