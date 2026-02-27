import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import api from '../services/api'

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        Promise.all([api.getDashboardStats(), api.getActivity()])
            .then(([s, a]) => { setStats(s); setActivities(a) })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [])

    const quickActions = [
        { icon: '🔍', label: 'Discovery Scan', desc: 'AI scan for PII', path: '/dashboard/discovery' },
        { icon: '📝', label: 'Consent Notice', desc: 'Create a DPDPA record', path: '/dashboard/consent' },
        { icon: '📋', label: 'Process DSR', desc: 'Log a subject request', path: '/dashboard/dsr' },
        { icon: '🛡️', label: 'Guardrails', desc: 'Manage defenses', path: '/dashboard/guardrails' },
    ]

    if (loading) return (
        <div className="dash-loading">
            <div className="spinner" />
            <span>Harmonizing privacy data...</span>
        </div>
    )

    return (
        <div className="animate-fade-in">
            {/* Page header */}
            <div className="page-header mb-8">
                <div>
                    <h1>Privacy <span className="text-gradient">Overview</span></h1>
                    <p>Real-time posture monitoring and compliance intelligence.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/dashboard/discovery')}>
                    🚀 Run AI Scan
                </button>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid mb-8">
                <StatCard icon="📦" value={stats?.total_assets?.toLocaleString() || '0'} label="Assets Tracked" trend="+12.4%" />
                <StatCard icon="✅" value={`${stats?.consent_coverage || 0}%`} label="Consent Coverage" trend="+1.8%" />
                <StatCard icon="📋" value={stats?.open_dsrs || 0} label="Active DSRs" trend="-3" />
                <StatCard icon="⚠️" value={stats?.active_risks || 0} label="Critical Risks" trend="-2" />
            </div>

            {/* Main content grid */}
            <div className="dash-grid-2">
                {/* Activity Feed */}
                <div className="card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                        <span className="status-dot green">Live</span>
                    </div>
                    <div className="card-body p-0">
                        {activities.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-icon">📡</span>
                                <p>No recent activity detected.</p>
                            </div>
                        ) : activities.map((a, i) => (
                            <div key={a.id || i} className="activity-row">
                                <div className={`activity-dot ${a.color || 'cyan'}`} />
                                <div className="activity-content">
                                    <span className="activity-msg">{a.message}</span>
                                    <span className="activity-time">{new Date(a.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column */}
                <div className="dash-right-col">
                    {/* Quick Actions */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="card-body">
                            {quickActions.map((qa, i) => (
                                <div key={i} className="action-row" onClick={() => navigate(qa.path)}>
                                    <span className="action-icon">{qa.icon}</span>
                                    <div className="action-text">
                                        <span className="action-label">{qa.label}</span>
                                        <span className="action-desc">{qa.desc}</span>
                                    </div>
                                    <span className="action-arrow">→</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DPDPA Score */}
                    <div className="card card-accent">
                        <div className="card-header">
                            <h3>DPDPA Readiness</h3>
                            <span className="badge badge-cyan">Auto-assessed</span>
                        </div>
                        <div className="card-body text-center">
                            <div className="score-ring">
                                <span className="score-value text-gradient">{stats?.consent_coverage || 0}%</span>
                            </div>
                            <p className="score-label">Compliance readiness score</p>
                            <div className="score-bar">
                                <div className="score-bar-fill" style={{ width: `${stats?.consent_coverage || 0}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
