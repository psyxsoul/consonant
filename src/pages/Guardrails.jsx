import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Guardrails() {
    const [guardrails, setGuardrails] = useState([])
    const [proxyLog, setProxyLog] = useState([])
    const [vaults, setVaults] = useState([])
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)

    const load = () => {
        Promise.all([api.getGuardrails(), api.getGuardrailStats(), api.getProxyLog(), api.getVaults()])
            .then(([g, s, p, v]) => { setGuardrails(g); setStats(s); setProxyLog(p); setVaults(v) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleToggle = async (id) => {
        try {
            await api.toggleGuardrail(id)
            load()
        } catch (err) { alert(err.message) }
    }

    if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Active Guardrails</h1>
                    <p className="page-header-subtitle">Automated privacy defense — masking, tokenization, vaults, and AI proxy</p>
                </div>
                <button className="btn btn-primary">+ Add Guardrail</button>
            </div>

            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card"><div className="stat-card-value">{stats.total || 0}</div><div className="stat-card-label">Total Guardrails</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{stats.active || 0}</div><div className="stat-card-label">Active</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>{stats.totalRedacted || 0}</div><div className="stat-card-label">Fields Redacted Today</div></div>
                <div className="stat-card"><div className="stat-card-value">{stats.vaultCount || 0}</div><div className="stat-card-label">Privacy Vaults</div></div>
            </div>

            <div className="grid-2">
                <div>
                    <div className="dash-panel">
                        <div className="dash-panel-header"><h3>Defense Configuration</h3></div>
                        {guardrails.map((g) => (
                            <div className="guardrail-card" key={g.id}>
                                <div className={`guardrail-status ${g.is_active ? 'active' : 'inactive'}`} />
                                <div className="guardrail-info">
                                    <h4>{g.name}</h4>
                                    <p>{g.description}</p>
                                    <span className="badge badge-violet" style={{ marginTop: 4, fontSize: '0.65rem' }}>{g.category}</span>
                                </div>
                                <div className={`guardrail-toggle ${g.is_active ? 'on' : ''}`} onClick={() => handleToggle(g.id)} />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="dash-panel">
                        <div className="dash-panel-header">
                            <h3>AI Proxy Redaction Log</h3>
                            <span className="badge badge-green">● Live</span>
                        </div>
                        {proxyLog.map((entry, i) => (
                            <div className="activity-item" key={entry.id || i}>
                                <span className="activity-dot cyan" />
                                <div style={{ flex: 1 }}>
                                    <div className="activity-text">
                                        <strong>{entry.user_name}</strong> → {entry.model}
                                        <span style={{ marginLeft: 8 }} className="badge badge-red">{entry.fields_redacted} redacted</span>
                                    </div>
                                    <div className="flex gap-2" style={{ marginTop: 4, flexWrap: 'wrap' }}>
                                        {(entry.redacted_types || []).map((t, j) => (
                                            <span key={j} className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{t}</span>
                                        ))}
                                    </div>
                                    <div className="activity-time">{entry.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="dash-panel">
                        <div className="dash-panel-header"><h3>Privacy Vaults</h3></div>
                        {vaults.map((v) => (
                            <div className="guardrail-card" key={v.id}>
                                <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: 'var(--radius-sm)', background: 'var(--accent-violet-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🔒</div>
                                <div className="guardrail-info" style={{ flex: 1 }}>
                                    <h4>{v.name}</h4>
                                    <p>{v.records?.toLocaleString()} records · {v.size} · Last access: {v.last_access}</p>
                                </div>
                                <span className="badge badge-green">🔐 Encrypted</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
