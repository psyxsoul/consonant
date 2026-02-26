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
        { icon: '🔍', label: 'Run Discovery Scan', desc: 'AI scan for PII in your data', color: 'var(--accent-cyan-dim)', path: '/dashboard/discovery' },
        { icon: '📝', label: 'New Consent Notice', desc: 'Create a DPDPA consent record', color: 'var(--accent-violet-dim)', path: '/dashboard/consent' },
        { icon: '📋', label: 'Process DSR', desc: 'Log a data subject request', color: 'var(--accent-amber-dim)', path: '/dashboard/dsr' },
        { icon: '🛡️', label: 'Manage Guardrails', desc: 'Toggle active defenses', color: 'var(--accent-green-dim)', path: '/dashboard/guardrails' },
    ]

    if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading dashboard...</div>
    if (error) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--accent-red)' }}>Error: {error}</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Privacy Dashboard</h1>
                    <p className="page-header-subtitle">Real-time overview — all data is live from your backend</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/dashboard/discovery')}>🔍 Run AI Scan</button>
            </div>

            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <StatCard icon="📦" iconBg="var(--accent-cyan-dim)" value={stats?.total_assets?.toLocaleString() || '0'} label="Data Assets Tracked" trend="12%" trendDir="up" />
                <StatCard icon="✅" iconBg="var(--accent-green-dim)" value={`${stats?.consent_coverage || 0}%`} label="Consent Coverage" trend="1.8%" trendDir="up" />
                <StatCard icon="📋" iconBg="var(--accent-amber-dim)" value={stats?.open_dsrs || 0} label="Open DSRs" trend="3" trendDir="down" />
                <StatCard icon="⚠️" iconBg="var(--accent-red-dim)" value={stats?.active_risks || 0} label="Active Risks" trend="2" trendDir="down" />
            </div>

            <div className="grid-2">
                <div className="dash-panel">
                    <div className="dash-panel-header">
                        <h3>Recent Activity</h3>
                        <span className="badge badge-green">● Live</span>
                    </div>
                    {activities.map((a, i) => (
                        <div className="activity-item" key={a.id || i}>
                            <span className={`activity-dot ${a.color || 'cyan'}`} />
                            <div>
                                <div className="activity-text">{a.message}</div>
                                <div className="activity-time">{new Date(a.timestamp).toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: 'var(--space-4)' }}>No recent activity. Perform a scan or create records to see updates here.</p>}
                </div>

                <div>
                    <div className="dash-panel">
                        <div className="dash-panel-header"><h3>Quick Actions</h3></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {quickActions.map((qa, i) => (
                                <div key={i} className="guardrail-card" style={{ cursor: 'pointer' }} onClick={() => navigate(qa.path)}>
                                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: qa.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{qa.icon}</div>
                                    <div className="guardrail-info">
                                        <h4>{qa.label}</h4>
                                        <p>{qa.desc}</p>
                                    </div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>→</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="dash-panel">
                        <div className="dash-panel-header">
                            <h3>DPDPA Compliance Score</h3>
                            <span className="badge badge-green">On Track</span>
                        </div>
                        <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 800, background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                                {stats?.consent_coverage || 0}%
                            </div>
                            <p style={{ fontSize: '0.85rem', marginTop: 'var(--space-2)' }}>Based on live consent coverage data</p>
                        </div>
                        <div className="progress-bar" style={{ marginTop: 'var(--space-3)' }}>
                            <div className="progress-bar-fill" style={{ width: `${stats?.consent_coverage || 0}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
