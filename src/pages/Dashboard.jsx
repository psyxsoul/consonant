import StatCard from '../components/StatCard'

const activities = [
    { color: 'red', text: 'Critical: Aadhaar numbers detected in users_export.csv without consent mapping', time: '2 min ago' },
    { color: 'amber', text: 'DSR erasure request #1247 requires manual review — data found in 3 external SaaS tools', time: '15 min ago' },
    { color: 'green', text: 'Consent notice CN-0421 verified and linked to 12,847 data subjects', time: '1 hour ago' },
    { color: 'cyan', text: 'Data mapping scan completed for PostgreSQL production database (142 tables)', time: '2 hours ago' },
    { color: 'violet', text: 'AI Proxy redacted 24 sensitive fields from employee prompts sent to external LLM', time: '3 hours ago' },
    { color: 'green', text: 'DPDPA compliance score updated: 94.2% (+1.8% from last week)', time: '4 hours ago' },
]

const quickActions = [
    { icon: '🔍', label: 'Run Discovery Scan', desc: 'Scan connected sources for PII', color: 'var(--accent-cyan-dim)' },
    { icon: '📝', label: 'New Consent Notice', desc: 'Draft a DPDPA-compliant notice', color: 'var(--accent-violet-dim)' },
    { icon: '📋', label: 'Process DSR', desc: 'Handle a new subject request', color: 'var(--accent-amber-dim)' },
    { icon: '🛡️', label: 'Enable Guardrail', desc: 'Activate an active defense', color: 'var(--accent-green-dim)' },
]

export default function Dashboard() {
    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Privacy Dashboard</h1>
                    <p className="page-header-subtitle">Real-time overview of your privacy posture</p>
                </div>
                <button className="btn btn-primary">+ New Scan</button>
            </div>

            {/* Stat Cards */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <StatCard
                    icon="📦"
                    iconBg="var(--accent-cyan-dim)"
                    value="24,819"
                    label="Data Assets Tracked"
                    trend="12%"
                    trendDir="up"
                />
                <StatCard
                    icon="✅"
                    iconBg="var(--accent-green-dim)"
                    value="94.2%"
                    label="Consent Coverage"
                    trend="1.8%"
                    trendDir="up"
                />
                <StatCard
                    icon="📋"
                    iconBg="var(--accent-amber-dim)"
                    value="17"
                    label="Open DSRs"
                    trend="3"
                    trendDir="down"
                />
                <StatCard
                    icon="⚠️"
                    iconBg="var(--accent-red-dim)"
                    value="5"
                    label="Active Risks"
                    trend="2"
                    trendDir="down"
                />
            </div>

            <div className="grid-2">
                {/* Activity Feed */}
                <div className="dash-panel">
                    <div className="dash-panel-header">
                        <h3>Recent Activity</h3>
                        <button className="btn btn-ghost">View All</button>
                    </div>
                    {activities.map((a, i) => (
                        <div className="activity-item" key={i}>
                            <span className={`activity-dot ${a.color}`} />
                            <div>
                                <div className="activity-text">{a.text}</div>
                                <div className="activity-time">{a.time}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <div className="dash-panel">
                        <div className="dash-panel-header">
                            <h3>Quick Actions</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {quickActions.map((qa, i) => (
                                <div key={i} className="guardrail-card" style={{ cursor: 'pointer' }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                                        background: qa.color, display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: '1.2rem'
                                    }}>
                                        {qa.icon}
                                    </div>
                                    <div className="guardrail-info">
                                        <h4>{qa.label}</h4>
                                        <p>{qa.desc}</p>
                                    </div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>→</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compliance Score */}
                    <div className="dash-panel">
                        <div className="dash-panel-header">
                            <h3>DPDPA Compliance Score</h3>
                            <span className="badge badge-green">On Track</span>
                        </div>
                        <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
                            <div style={{
                                fontSize: '3rem', fontWeight: 800,
                                background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent', lineHeight: 1
                            }}>
                                94.2%
                            </div>
                            <p style={{ fontSize: '0.85rem', marginTop: 'var(--space-2)' }}>
                                Overall compliance across 12 control areas
                            </p>
                        </div>
                        <div className="progress-bar" style={{ marginTop: 'var(--space-3)' }}>
                            <div className="progress-bar-fill" style={{ width: '94.2%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
