import { useState, useEffect } from 'react'
import api from '../services/api'

export default function DataMap() {
    const [entries, setEntries] = useState([])
    const [flow, setFlow] = useState([])
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ activity: '', data_categories: '', purpose: '', legal_basis: 'Consent', retention: '', risk_level: 'Medium' })
    const [error, setError] = useState(null)
    const [creating, setCreating] = useState(false)

    const load = () => {
        Promise.all([api.getDataMap(), api.getDataFlow(), api.getDataMapStats()])
            .then(([e, f, s]) => { setEntries(e); setFlow(f); setStats(s) })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleCreate = async (e) => {
        e.preventDefault(); setCreating(true)
        try {
            await api.createDataMap(form); setShowForm(false)
            setForm({ activity: '', data_categories: '', purpose: '', legal_basis: 'Consent', retention: '', risk_level: 'Medium' }); load()
        } catch (err) { setError(err.message) }
        finally { setCreating(false) }
    }

    const riskColors = { Critical: 'badge-red', High: 'badge-amber', Medium: 'badge-cyan', Low: 'badge-green' }

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Rendering Graph Topography...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>Data Lineage & RoPA</h1>
                    <p>Dynamic visual mapping of processing activities across borders</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Log Activity</button>
            </div>

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {showForm && (
                <div className="card card-highlight-cyan mb-8 animate-fade-in shadow-xl relative z-10" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    <div className="card-header border-b"><h3>Map New Processing Activity</h3></div>
                    <div className="card-body">
                        <form onSubmit={handleCreate} className="form-grid form-grid-3">
                            <div className="form-group"><label className="form-label">Activity Context</label><input className="form-input" placeholder="e.g. AWS Payment Gateway" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Defined Purpose</label><input className="form-input" placeholder="Value extraction" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Data Classes</label><input className="form-input" placeholder="Financial, PII, Health..." value={form.data_categories} onChange={(e) => setForm({ ...form, data_categories: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Lawful Basis</label><select className="form-select" value={form.legal_basis} onChange={(e) => setForm({ ...form, legal_basis: e.target.value })}><option>Consent</option><option>Legitimate Interest</option><option>Contract</option><option>Legal Obligation</option></select></div>
                            <div className="form-group"><label className="form-label">Retention SLA</label><input className="form-input" placeholder="e.g. 5 Years" value={form.retention} onChange={(e) => setForm({ ...form, retention: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Inherent Risk</label><select className="form-select" value={form.risk_level} onChange={(e) => setForm({ ...form, risk_level: e.target.value })}><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></div>
                            <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Syncing...' : 'Map to Graph'}</button><button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button></div>
                        </form>
                    </div>
                </div>
            )}

            {/* Interactive Flow Visualizer */}
            {flow.length > 0 && (
                <div className="card mb-8 card-accent" style={{ background: 'linear-gradient(180deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)' }}>
                    <div className="card-header border-b">
                        <h3>Global Data Lifecycle</h3>
                        <div className="flex gap-2">
                            <span className="status-dot green">Real-time sync</span>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="flow-container">
                            <div className="flow-line" />
                            <div className="flow-line-active" />
                            {flow.map((stage, i) => (
                                <div key={stage.id} className="relative z-10 flex flex-col items-center" style={{ width: '140px', padding: '0 10px' }}>
                                    <div className="flow-node mb-3" title={stage.description}>
                                        {stage.icon}
                                    </div>
                                    <span className="text-center font-bold" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{stage.title}</span>
                                    <span className="badge badge-cyan mt-2" style={{ fontSize: '0.65rem' }}>{stage.count} {stage.count_label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="kpi-grid mb-6">
                {[
                    { label: 'Total Mapped Entities', value: stats.total || entries.length },
                    { label: 'Critical Flows', value: stats.critical || entries.filter(e => e.risk_level === 'Critical').length, color: 'var(--accent-red)' },
                    { label: 'High Risk Transfer', value: stats.high || entries.filter(e => e.risk_level === 'High').length, color: 'var(--accent-amber)' },
                    { label: 'Compliant Nodes', value: stats.low || entries.filter(e => e.risk_level === 'Low').length, color: 'var(--accent-green)' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card"><div className="kpi-top"><span className="kpi-label">{s.label}</span></div><div className="kpi-value" style={s.color ? { color: s.color } : undefined}>{s.value}</div></div>
                ))}
            </div>

            {/* Expanded RoPA Cards */}
            <h3 className="mb-4 text-secondary" style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Record of Processing</h3>
            <div className="vault-grid">
                {entries.map((e) => (
                    <div key={e.id} className="vault-card hover:border-cyan transition-colors" style={{ padding: 'var(--space-6)' }}>
                        <div className="vault-header mb-4">
                            <div className="flex-col">
                                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{e.activity}</h4>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{e.purpose}</span>
                            </div>
                            <span className={`badge ${riskColors[e.risk_level] || 'badge-cyan'}`}>{e.risk_level}</span>
                        </div>

                        <div className="flex-col gap-2 mb-4 mt-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Data Types</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--accent-cyan)' }}>{e.data_categories}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Legal Basis</span>
                                <span className="badge badge-violet">{e.legal_basis}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Retention</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{e.retention}</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-subtle flex justify-end">
                            <button className="btn-text" style={{ color: 'var(--accent-red)' }} onClick={() => handleDelete(e.id)}>Revoke Node</button>
                        </div>
                    </div>
                ))}
                {entries.length === 0 && (
                    <div className="card p-8 text-center flex-col items-center justify-center" style={{ gridColumn: '1 / -1' }}>
                        <span style={{ fontSize: '3rem', opacity: 0.5, marginBottom: 'var(--space-4)' }}>🗺️</span>
                        <p className="text-muted">No processing workflows constructed. Plot your first node to configure the global map.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
