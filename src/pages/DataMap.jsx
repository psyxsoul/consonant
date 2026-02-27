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

    if (loading) return (
        <div className="flex-col items-center justify-center animate-fade-in" style={{ height: '60vh', color: 'var(--text-muted)' }}>
            <div className="text-center">
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-violet-dim)', borderTopColor: 'var(--accent-violet)', borderRadius: '50%', animation: 'rotate 1s linear infinite', margin: '0 auto 16px' }} />
                <span>Loading Data Map...</span>
            </div>
        </div>
    )

    return (
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="page-header flex justify-between items-end mb-8">
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Data Map & RoPA</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Record of Processing Activities — track every data flow</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Add RoPA Entry</button>
            </div>

            {error && (
                <div className="p-4 mb-6 flex justify-between items-center" style={{ background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--accent-red)', fontSize: '0.9rem' }}>
                    {error} <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                </div>
            )}

            {showForm && (
                <div className="glass-card mb-8 animate-fade-in" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
                    <h3 className="mb-6" style={{ fontSize: '1.2rem' }}>Add Processing Activity</h3>
                    <form onSubmit={handleCreate} className="grid-2">
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Activity Name</label>
                            <input className="form-input" placeholder="e.g. Payment Processing" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} required />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Purpose</label>
                            <input className="form-input" placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Data Categories</label>
                            <input className="form-input" placeholder="Comma-separated" value={form.data_categories} onChange={(e) => setForm({ ...form, data_categories: e.target.value })} required />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Legal Basis</label>
                            <select className="form-select" value={form.legal_basis} onChange={(e) => setForm({ ...form, legal_basis: e.target.value })}>
                                <option>Consent</option><option>Legitimate Interest</option><option>Contract</option><option>Legal Obligation</option>
                            </select>
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Retention Period</label>
                            <input className="form-input" placeholder="e.g. 5 years" value={form.retention} onChange={(e) => setForm({ ...form, retention: e.target.value })} required />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Risk Level</label>
                            <select className="form-select" value={form.risk_level} onChange={(e) => setForm({ ...form, risk_level: e.target.value })}>
                                <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
                            </select>
                        </div>
                        <div className="flex gap-4 mt-4" style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Add Entry'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats */}
            <div className="grid-4 mb-8">
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stats.total || entries.length}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Processing Activities</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-red)', lineHeight: 1 }}>{stats.critical || entries.filter(e => e.risk_level === 'Critical').length}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Critical Risk</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-amber)', lineHeight: 1 }}>{stats.high || entries.filter(e => e.risk_level === 'High').length}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>High Risk</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>{stats.low || entries.filter(e => e.risk_level === 'Low').length}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Low Risk</div>
                </div>
            </div>

            {/* Data Flow Pipeline */}
            {flow.length > 0 && (
                <div className="glass-card mb-8">
                    <div className="mb-6"><h3 style={{ fontSize: '1.2rem' }}>Data Lifecycle Pipeline</h3></div>
                    <div className="flex gap-4 py-4" style={{ overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
                        {flow.map((stage, i) => (
                            <div key={stage.id} className="flex items-center">
                                <div className="flex-col items-center justify-center p-6" style={{ minWidth: 200, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', transition: 'all var(--transition-base)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.transform = 'none' }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>{stage.icon}</div>
                                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4, color: 'var(--text-primary)' }}>{stage.title}</div>
                                    <div className="text-center" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, minHeight: '36px' }}>{stage.description}</div>
                                    <span className="badge badge-cyan">{stage.count} {stage.count_label}</span>
                                </div>
                                {i < flow.length - 1 && <span style={{ padding: '0 var(--space-4)', fontSize: '1.5rem', color: 'var(--text-muted)' }}>→</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* RoPA Table */}
            <div className="glass-card p-0" style={{ overflow: 'hidden' }}>
                <div className="flex justify-between items-center p-6 border-b border-default" style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>Record of Processing Activities</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{entries.length} entries</span>
                </div>
                {entries.length > 0 ? (
                    <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>Activity</th><th>Data Categories</th><th>Purpose</th><th>Legal Basis</th><th>Retention</th><th>Risk</th><th></th></tr>
                            </thead>
                            <tbody>
                                {entries.map((e) => (
                                    <tr key={e.id}>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{e.activity}</td>
                                        <td style={{ fontSize: '0.85rem' }}>{e.data_categories}</td>
                                        <td style={{ fontSize: '0.9rem' }}>{e.purpose}</td>
                                        <td><span className="badge badge-violet">{e.legal_basis}</span></td>
                                        <td style={{ fontSize: '0.9rem' }}>{e.retention}</td>
                                        <td><span className={`badge ${riskColors[e.risk_level] || 'badge-cyan'}`}>{e.risk_level}</span></td>
                                        <td><button className="btn btn-ghost" onClick={() => handleDelete(e.id)} style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }} title="Delete">✕</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-10 text-center" style={{ color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📋</p>
                        <p style={{ fontSize: '1.1rem' }}>No processing activities logged. Click "Add RoPA Entry" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
