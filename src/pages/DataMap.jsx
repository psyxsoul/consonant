import { useState, useEffect } from 'react'
import api from '../services/api'

const riskColor = (risk) => {
    const map = { Critical: 'badge-red', High: 'badge-amber', Medium: 'badge-cyan', Low: 'badge-green' }
    return map[risk] || 'badge-cyan'
}

export default function DataMap() {
    const [entries, setEntries] = useState([])
    const [flow, setFlow] = useState([])
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([api.getDataMap(), api.getDataFlow(), api.getDataMapStats()])
            .then(([e, f, s]) => { setEntries(e); setFlow(f); setStats(s) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Data Map & RoPA</h1>
                    <p className="page-header-subtitle">Live Record of Processing Activities across your entire architecture</p>
                </div>
                <button className="btn btn-primary">↻ Refresh Map</button>
            </div>

            <div className="dash-panel">
                <div className="dash-panel-header">
                    <h3>Data Flow Architecture</h3>
                    <span className="badge badge-green">Live</span>
                </div>
                <div className="dataflow-container">
                    {flow.map((stage, i) => (
                        <div className="dataflow-stage" key={stage.id || i}>
                            <div className="dataflow-stage-icon">{stage.icon}</div>
                            <h4>{stage.title}</h4>
                            <p>{stage.description}</p>
                            <div style={{ marginTop: 'var(--space-3)' }}>
                                <span className="badge badge-cyan">{stage.count} {stage.count_label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="dash-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="dash-panel-header" style={{ padding: 'var(--space-5) var(--space-6)' }}>
                    <h3>Record of Processing Activities (RoPA)</h3>
                    <button className="btn btn-ghost">Export PDF</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr><th>Processing Activity</th><th>Data Categories</th><th>Purpose</th><th>Legal Basis</th><th>Retention</th><th>Risk Level</th></tr>
                    </thead>
                    <tbody>
                        {entries.map((r) => (
                            <tr key={r.id}>
                                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.activity}</td>
                                <td>{r.data_categories}</td>
                                <td>{r.purpose}</td>
                                <td><span className="badge badge-violet">{r.legal_basis}</span></td>
                                <td>{r.retention}</td>
                                <td><span className={`badge ${riskColor(r.risk_level)}`}>{r.risk_level}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid-3" style={{ marginTop: 'var(--space-6)' }}>
                <div className="stat-card"><div className="stat-card-value">{stats.tables_mapped}</div><div className="stat-card-label">Database Tables Mapped</div></div>
                <div className="stat-card"><div className="stat-card-value">{stats.connected_systems}</div><div className="stat-card-label">Connected Systems</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{stats.map_coverage}%</div><div className="stat-card-label">Map Coverage</div></div>
            </div>
        </div>
    )
}
