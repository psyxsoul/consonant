import { useState, useEffect } from 'react'
import api from '../services/api'

const typeBadge = (type) => {
    const map = { Erasure: 'badge-red', Access: 'badge-cyan', Portability: 'badge-violet', Rectification: 'badge-amber' }
    return map[type] || 'badge-cyan'
}

export default function DSRManager() {
    const [requests, setRequests] = useState([])
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ type: 'Erasure', subject_name: '', subject_email: '', priority: 'Medium' })
    const [error, setError] = useState(null)
    const [creating, setCreating] = useState(false)

    const load = () => {
        Promise.all([api.getDSR(), api.getDSRStats()])
            .then(([r, s]) => { setRequests(r); setStats(s) })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleCreate = async (e) => {
        e.preventDefault(); setCreating(true)
        try {
            await api.createDSR(form); setShowForm(false)
            setForm({ type: 'Erasure', subject_name: '', subject_email: '', priority: 'Medium' }); load()
        } catch (err) { setError(err.message) }
        finally { setCreating(false) }
    }

    const handlePromote = async (id, currentStatus) => {
        const flow = { 'pending': 'in-progress', 'in-progress': 'completed' }
        const next = flow[currentStatus]
        if (!next) return
        const progress = next === 'completed' ? 100 : 50
        try { await api.updateDSR(id, { status: next, progress }); load() }
        catch (err) { setError(err.message) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Purge this request?')) return
        try { await api.deleteDSR(id); load() } catch (err) { setError(err.message) }
    }

    const columns = [
        { id: 'pending', title: 'Intake Queue', color: 'var(--text-muted)' },
        { id: 'in-progress', title: 'Processing', color: 'var(--accent-amber)' },
        { id: 'completed', title: 'Fulfilled', color: 'var(--accent-green)' }
    ]

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Fetching Request Queue...</span></div>

    return (
        <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header mb-8 flex-shrink-0">
                <div>
                    <h1>DSR Fulfillment Hub</h1>
                    <p>Automate and track Data Subject Rights across systems</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Log Request</button>
            </div>

            {error && <div className="error-banner mb-6 flex-shrink-0">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {showForm && (
                <div className="card card-highlight-amber mb-8 animate-fade-in shadow-xl flex-shrink-0 relative z-10" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                    <div className="card-header border-b"><h3>Intake New Action</h3></div>
                    <div className="card-body">
                        <form onSubmit={handleCreate} className="form-grid">
                            <div className="form-group"><label className="form-label">Subject Identity</label><input className="form-input" placeholder="Full Name" value={form.subject_name} onChange={(e) => setForm({ ...form, subject_name: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Verification Anchor (Email)</label><input className="form-input" type="email" placeholder="email@address.com" value={form.subject_email} onChange={(e) => setForm({ ...form, subject_email: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Request Vector</label><select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Erasure</option><option>Access</option><option>Portability</option><option>Rectification</option></select></div>
                            <div className="form-group"><label className="form-label">Triage Priority</label><select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>High</option><option>Medium</option><option>Low</option></select></div>
                            <div className="form-actions border-t pt-4 mt-2" style={{ borderColor: 'var(--border-subtle)' }}><button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Logging...' : 'Queue Intake'}</button><button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Abort</button></div>
                        </form>
                    </div>
                </div>
            )}

            <div className="kpi-grid mb-8 flex-shrink-0">
                {[
                    { label: 'Total Volume', value: stats.total || 0, icon: '📥' },
                    { label: 'Unassigned', value: stats.pending || 0, color: 'var(--text-muted)', icon: '⏳' },
                    { label: 'Active Processing', value: stats.inProgress || 0, color: 'var(--accent-amber)', icon: '⚙️' },
                    { label: 'SLA Met', value: stats.completed || 0, color: 'var(--accent-green)', icon: '✅' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card"><div className="kpi-top"><span className="kpi-label">{s.label}</span></div><div className="kpi-value" style={s.color ? { color: s.color } : undefined}>{s.value}</div><div className="kpi-icon" style={{ opacity: 0.1 }}>{s.icon}</div></div>
                ))}
            </div>

            {/* Premium Kanban Board */}
            <div className="kanban-board flex-1">
                {columns.map(col => {
                    const colRequests = requests.filter(r => r.status === col.id)
                    return (
                        <div key={col.id} className="kanban-column">
                            <div className="kanban-header">
                                <div className="flex items-center gap-2">
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                                    <span className="kanban-title" style={{ color: col.color }}>{col.title}</span>
                                </div>
                                <span className="kanban-count">{colRequests.length}</span>
                            </div>

                            <div className="flex-col gap-3" style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
                                {colRequests.map(dsr => (
                                    <div key={dsr.id} className="kanban-card">
                                        <div className="kanban-card-top mb-1">
                                            <span className="text-cyan font-bold" style={{ fontSize: '0.75rem' }}>{dsr.request_id}</span>
                                            {dsr.priority === 'High' ? (
                                                <span className="kanban-due urgent">⚡ SLA Risk</span>
                                            ) : (
                                                <span className="kanban-due">⏱️ {dsr.deadline}</span>
                                            )}
                                        </div>

                                        <div className="flex-col gap-1 mb-2">
                                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dsr.subject_name}</h4>
                                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>{dsr.subject_email}</span>
                                        </div>

                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`badge ${typeBadge(dsr.type)} bg-transparent border`}>{dsr.type}</span>
                                        </div>

                                        {dsr.status !== 'completed' && (
                                            <div className="progress-bar mb-3" style={{ height: '4px', background: 'var(--bg-primary)' }}>
                                                <div className="progress-bar-fill" style={{ width: `${dsr.progress}%`, background: dsr.progress > 50 ? 'var(--accent-amber)' : 'var(--accent-cyan)' }} />
                                            </div>
                                        )}

                                        <div className="flex justify-between border-t border-subtle pt-3 mt-auto">
                                            <button className="btn-icon-danger" onClick={() => handleDelete(dsr.id)} title="Purge">✕</button>

                                            {dsr.status !== 'completed' && (
                                                <button className="btn-text" style={{ fontSize: '0.7rem' }} onClick={() => handlePromote(dsr.id, dsr.status)}>
                                                    Advance →
                                                </button>
                                            )}
                                            {dsr.status === 'completed' && (
                                                <span className="text-green flex items-center gap-1" style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                                                    ✓ Finalized
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {colRequests.length === 0 && (
                                    <div className="p-6 text-center text-muted" style={{ fontSize: '0.8rem', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                        Queue empty
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
