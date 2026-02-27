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

    if (loading) return (
        <div className="flex-col items-center justify-center animate-fade-in" style={{ height: '60vh', color: 'var(--text-muted)' }}>
            <div className="text-center">
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-cyan-dim)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', animation: 'rotate 1s linear infinite', margin: '0 auto 16px' }} />
                <span>Loading DSR data...</span>
            </div>
        </div>
    )

    return (
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="page-header flex justify-between items-end mb-8">
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>DSR Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Track and fulfill Data Subject Rights requests — real CRUD operations</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Log New Request</button>
            </div>

            {error && (
                <div className="p-4 mb-6 flex justify-between items-center" style={{ background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--accent-red)', fontSize: '0.9rem' }}>
                    {error} <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                </div>
            )}

            {showForm && (
                <div className="glass-card mb-8 animate-fade-in" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
                    <h3 className="mb-6" style={{ fontSize: '1.2rem' }}>Log New DSR Request</h3>
                    <form onSubmit={handleCreate} className="grid-2">
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subject Name</label>
                            <input className="form-input" placeholder="Subject Name" value={form.subject_name} onChange={(e) => setForm({ ...form, subject_name: e.target.value })} required />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subject Email</label>
                            <input className="form-input" type="email" placeholder="Subject Email" value={form.subject_email} onChange={(e) => setForm({ ...form, subject_email: e.target.value })} required />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Request Type</label>
                            <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                                <option>Erasure</option><option>Access</option><option>Portability</option><option>Rectification</option>
                            </select>
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Priority Level</label>
                            <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                                <option>High</option><option>Medium</option><option>Low</option>
                            </select>
                        </div>
                        <div className="flex gap-4 mt-4" style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Create Request'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid-4 mb-8">
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stats.total || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Total Requests</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-amber)', lineHeight: 1 }}>{stats.inProgress || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>In Progress</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)', lineHeight: 1 }}>{stats.pending || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Pending</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>{stats.completed || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Completed</div>
                </div>
            </div>

            <div className="flex-col gap-6">
                {requests.map((dsr) => (
                    <div key={dsr.id} className="glass-card">
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-4" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                            <div className="flex items-center gap-4">
                                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>{dsr.request_id}</span>
                                <span className={`badge ${typeBadge(dsr.type)}`}>{dsr.type}</span>
                                {dsr.priority === 'High' && <span className="badge badge-red">⚡ High</span>}
                            </div>
                            <div className="flex items-center gap-4">
                                <select className="form-select" style={{ padding: '4px 8px', fontSize: '0.85rem', minWidth: '120px' }} value={dsr.status} onChange={(e) => handleUpdateStatus(dsr.id, e.target.value)}>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <button className="btn btn-ghost" onClick={() => handleDelete(dsr.id)} style={{ color: 'var(--accent-red)', fontSize: '1rem', padding: '4px 8px' }} title="Delete">✕</button>
                            </div>
                        </div>
                        <div className="grid-3 mb-6" style={{ gap: 'var(--space-6)' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Data Subject</div>
                                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{dsr.subject_name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dsr.subject_email}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Deadline</div>
                                <div style={{ fontSize: '1rem', fontWeight: 500 }}>{dsr.deadline}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Submitted</div>
                                <div style={{ fontSize: '1rem', fontWeight: 500 }}>{dsr.submitted_at}</div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Progress</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dsr.progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: `${dsr.progress}%`, background: dsr.progress === 100 ? 'var(--accent-green)' : undefined }} />
                            </div>
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <div className="p-10 text-center" style={{ color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📋</p>
                        <p style={{ fontSize: '1.1rem' }}>No DSR requests yet. Click "Log New Request" to create one.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
