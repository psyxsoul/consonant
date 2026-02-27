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

    const handleDelete = async (id) => {
        if (!confirm('Delete this RoPA entry?')) return
        try { await api.deleteDataMap(id); load() } catch (err) { setError(err.message) }
    }

    const riskColors = { Critical: 'badge-red', High: 'badge-amber', Medium: 'badge-cyan', Low: 'badge-green' }

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Loading Data Map...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>Data Map & RoPA</h1>
                    <p>Record of Processing Activities — track every data flow</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Add Entry</button>
            </div>

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {showForm && (
                <div className="card card-highlight-cyan mb-6 animate-fade-in">
                    <div className="card-header"><h3>Add Processing Activity</h3></div>
                    <div className="card-body">
                        <form onSubmit={handleCreate} className="form-grid form-grid-3">
                            <div className="form-group"><label className="form-label">Activity</label><input className="form-input" placeholder="e.g. Payment Processing" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Purpose</label><input className="form-input" placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Data Categories</label><input className="form-input" placeholder="Comma-separated" value={form.data_categories} onChange={(e) => setForm({ ...form, data_categories: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Legal Basis</label><select className="form-select" value={form.legal_basis} onChange={(e) => setForm({ ...form, legal_basis: e.target.value })}><option>Consent</option><option>Legitimate Interest</option><option>Contract</option><option>Legal Obligation</option></select></div>
                            <div className="form-group"><label className="form-label">Retention</label><input className="form-input" placeholder="e.g. 5 years" value={form.retention} onChange={(e) => setForm({ ...form, retention: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Risk Level</label><select className="form-select" value={form.risk_level} onChange={(e) => setForm({ ...form, risk_level: e.target.value })}><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></div>
                            <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Add Entry'}</button><button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button></div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="kpi-grid mb-6">
                {[
                    { label: 'Activities', value: stats.total || entries.length },
                    { label: 'Critical', value: stats.critical || entries.filter(e => e.risk_level === 'Critical').length, color: 'var(--accent-red)' },
                    { label: 'High Risk', value: stats.high || entries.filter(e => e.risk_level === 'High').length, color: 'var(--accent-amber)' },
                    { label: 'Low Risk', value: stats.low || entries.filter(e => e.risk_level === 'Low').length, color: 'var(--accent-green)' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card"><div className="kpi-top"><span className="kpi-label">{s.label}</span></div><div className="kpi-value" style={s.color ? { color: s.color } : undefined}>{s.value}</div></div>
                ))}
            </div>

            {/* Pipeline */}
            {flow.length > 0 && (
                <div className="card mb-6">
                    <div className="card-header"><h3>Data Lifecycle Pipeline</h3></div>
                    <div className="card-body">
                        <div className="pipeline">
                            {flow.map((stage, i) => (
                                <div key={stage.id} className="pipeline-item">
                                    <div className="pipeline-card">
                                        <span className="pipeline-icon">{stage.icon}</span>
                                        <span className="pipeline-title">{stage.title}</span>
                                        <span className="pipeline-desc">{stage.description}</span>
                                        <span className="badge badge-cyan">{stage.count} {stage.count_label}</span>
                                    </div>
                                    {i < flow.length - 1 && <span className="pipeline-arrow">→</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="card">
                <div className="card-header"><h3>Processing Activities</h3><span className="text-muted" style={{ fontSize: '0.8rem' }}>{entries.length} entries</span></div>
                {entries.length > 0 ? (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead><tr><th>Activity</th><th>Categories</th><th>Purpose</th><th>Legal Basis</th><th>Retention</th><th>Risk</th><th></th></tr></thead>
                            <tbody>
                                {entries.map((e) => (
                                    <tr key={e.id}>
                                        <td style={{ fontWeight: 600 }}>{e.activity}</td>
                                        <td style={{ fontSize: '0.85rem' }}>{e.data_categories}</td>
                                        <td>{e.purpose}</td>
                                        <td><span className="badge badge-violet">{e.legal_basis}</span></td>
                                        <td>{e.retention}</td>
                                        <td><span className={`badge ${riskColors[e.risk_level] || 'badge-cyan'}`}>{e.risk_level}</span></td>
                                        <td><button className="btn-icon-danger" onClick={() => handleDelete(e.id)} title="Delete">✕</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state"><span className="empty-icon">📋</span><p>No activities logged. Click "Add Entry" to start.</p></div>
                )}
            </div>
        </div>
    )
}
