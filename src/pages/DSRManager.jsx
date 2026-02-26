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
        e.preventDefault()
        setCreating(true)
        try {
            await api.createDSR(form)
            setShowForm(false)
            setForm({ type: 'Erasure', subject_name: '', subject_email: '', priority: 'Medium' })
            load()
        } catch (err) { setError(err.message) }
        finally { setCreating(false) }
    }

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const progress = newStatus === 'completed' ? 100 : newStatus === 'in-progress' ? 50 : 20
            await api.updateDSR(id, { status: newStatus, progress })
            load()
        } catch (err) { setError(err.message) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this DSR request?')) return
        try { await api.deleteDSR(id); load() } catch (err) { setError(err.message) }
    }

    if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading DSR data...</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>DSR Management</h1>
                    <p className="page-header-subtitle">Track and fulfill Data Subject Rights requests — real CRUD operations</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Log New Request</button>
            </div>

            {error && (
                <div style={{ padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)', background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-red)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                    {error} <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}>✕</button>
                </div>
            )}

            {showForm && (
                <div className="dash-panel" style={{ borderLeft: '4px solid var(--accent-amber)', marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Log New DSR Request</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <input placeholder="Subject Name" value={form.subject_name} onChange={(e) => setForm({ ...form, subject_name: e.target.value })} required
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <input type="email" placeholder="Subject Email" value={form.subject_email} onChange={(e) => setForm({ ...form, subject_email: e.target.value })} required
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                            <option>Erasure</option><option>Access</option><option>Portability</option><option>Rectification</option>
                        </select>
                        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                            <option>High</option><option>Medium</option><option>Low</option>
                        </select>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 'var(--space-3)' }}>
                            <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Create Request'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card"><div className="stat-card-value">{stats.total || 0}</div><div className="stat-card-label">Total Requests</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{stats.inProgress || 0}</div><div className="stat-card-label">In Progress</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>{stats.pending || 0}</div><div className="stat-card-label">Pending</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{stats.completed || 0}</div><div className="stat-card-label">Completed</div></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {requests.map((dsr) => (
                    <div key={dsr.id} className="dash-panel" style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>{dsr.request_id}</span>
                                <span className={`badge ${typeBadge(dsr.type)}`}>{dsr.type}</span>
                                {dsr.priority === 'High' && <span className="badge badge-red">⚡ High</span>}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <select value={dsr.status} onChange={(e) => handleUpdateStatus(dsr.id, e.target.value)}
                                    style={{ padding: '4px 8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.8rem' }}>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <button className="btn btn-ghost" onClick={() => handleDelete(dsr.id)} style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }} title="Delete">✕</button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Data Subject</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{dsr.subject_name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dsr.subject_email}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Deadline</div>
                                <div style={{ fontSize: '0.9rem' }}>{dsr.deadline}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Submitted</div>
                                <div style={{ fontSize: '0.9rem' }}>{dsr.submitted_at}</div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dsr.progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: `${dsr.progress}%`, background: dsr.progress === 100 ? 'var(--accent-green)' : undefined }} />
                            </div>
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <div className="dash-panel" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>📋</p>
                        <p>No DSR requests yet. Click "Log New Request" to create one.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
