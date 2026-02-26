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
        e.preventDefault()
        setCreating(true)
        try {
            await api.createDataMap(form)
            setShowForm(false)
            setForm({ activity: '', data_categories: '', purpose: '', legal_basis: 'Consent', retention: '', risk_level: 'Medium' })
            load()
        } catch (err) { setError(err.message) }
        finally { setCreating(false) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this RoPA entry?')) return
        try { await api.deleteDataMap(id); load() } catch (err) { setError(err.message) }
    }

    const riskColors = { Critical: 'badge-red', High: 'badge-amber', Medium: 'badge-cyan', Low: 'badge-green' }

    if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading data map...</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Data Map & RoPA</h1>
                    <p className="page-header-subtitle">Record of Processing Activities — track every data flow</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Add RoPA Entry</button>
            </div>

            {error && (
                <div style={{ padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)', background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-red)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                    {error} <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}>✕</button>
                </div>
            )}

            {showForm && (
                <div className="dash-panel" style={{ borderLeft: '4px solid var(--accent-cyan)', marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Add Processing Activity</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <input placeholder="Activity (e.g. Payment Processing)" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} required
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <input placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <input placeholder="Data Categories (comma-separated)" value={form.data_categories} onChange={(e) => setForm({ ...form, data_categories: e.target.value })} required
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <select value={form.legal_basis} onChange={(e) => setForm({ ...form, legal_basis: e.target.value })}
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                            <option>Consent</option><option>Legitimate Interest</option><option>Contract</option><option>Legal Obligation</option>
                        </select>
                        <input placeholder="Retention Period (e.g. 5 years)" value={form.retention} onChange={(e) => setForm({ ...form, retention: e.target.value })} required
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <select value={form.risk_level} onChange={(e) => setForm({ ...form, risk_level: e.target.value })}
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                            <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
                        </select>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 'var(--space-3)' }}>
                            <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Add Entry'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card"><div className="stat-card-value">{stats.total || entries.length}</div><div className="stat-card-label">Processing Activities</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-red)' }}>{stats.critical || entries.filter(e => e.risk_level === 'Critical').length}</div><div className="stat-card-label">Critical Risk</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{stats.high || entries.filter(e => e.risk_level === 'High').length}</div><div className="stat-card-label">High Risk</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{stats.low || entries.filter(e => e.risk_level === 'Low').length}</div><div className="stat-card-label">Low Risk</div></div>
            </div>

            {/* Data Flow Pipeline */}
            {flow.length > 0 && (
                <div className="dash-panel" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="dash-panel-header"><h3>Data Lifecycle Pipeline</h3></div>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', overflowX: 'auto', padding: 'var(--space-4) 0' }}>
                        {flow.map((stage, i) => (
                            <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ minWidth: 160, textAlign: 'center', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>{stage.icon}</div>
                                    <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>{stage.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>{stage.description}</div>
                                    <span className="badge badge-cyan">{stage.count} {stage.count_label}</span>
                                </div>
                                {i < flow.length - 1 && <span style={{ padding: '0 var(--space-2)', fontSize: '1.5rem', color: 'var(--text-muted)' }}>→</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* RoPA Table */}
            <div className="dash-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="dash-panel-header" style={{ padding: 'var(--space-5) var(--space-6)' }}>
                    <h3>Record of Processing Activities</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{entries.length} entries</span>
                </div>
                {entries.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr><th>Activity</th><th>Data Categories</th><th>Purpose</th><th>Legal Basis</th><th>Retention</th><th>Risk</th><th></th></tr>
                        </thead>
                        <tbody>
                            {entries.map((e) => (
                                <tr key={e.id}>
                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{e.activity}</td>
                                    <td style={{ fontSize: '0.8rem' }}>{e.data_categories}</td>
                                    <td>{e.purpose}</td>
                                    <td><span className="badge badge-violet">{e.legal_basis}</span></td>
                                    <td>{e.retention}</td>
                                    <td><span className={`badge ${riskColors[e.risk_level] || 'badge-cyan'}`}>{e.risk_level}</span></td>
                                    <td><button className="btn btn-ghost" onClick={() => handleDelete(e.id)} style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>✕</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>No processing activities logged. Click "Add RoPA Entry" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
