import { useState, useEffect } from 'react'
import api from '../services/api'

const typeBadge = (type) => {
    const map = { Erasure: 'badge-red', Access: 'badge-cyan', Portability: 'badge-violet', Rectification: 'badge-amber' }
    return map[type] || 'badge-cyan'
}
const statusLabel = (s) => {
    const map = { 'pending': 'Pending', 'in-progress': 'In Progress', 'completed': 'Completed' }
    return map[s] || s
}

export default function DSRManager() {
    const [requests, setRequests] = useState([])
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ type: 'Erasure', subject_name: '', subject_email: '', priority: 'Medium' })

    const load = () => {
        Promise.all([api.getDSR(), api.getDSRStats()])
            .then(([r, s]) => { setRequests(r); setStats(s) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        try { await api.createDSR(form); setShowForm(false); setForm({ type: 'Erasure', subject_name: '', subject_email: '', priority: 'Medium' }); load() }
        catch (err) { alert(err.message) }
    }

    if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>DSR Management</h1>
                    <p className="page-header-subtitle">Track and fulfill Data Subject Rights requests across all data silos</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ Log New Request</button>
            </div>

            {showForm && (
                <div className="dash-panel" style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Create DSR Request</h3>
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
                            <button type="submit" className="btn btn-primary">Create Request</button>
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
                        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
                            <div className="flex items-center gap-4">
                                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>{dsr.request_id}</span>
                                <span className={`badge ${typeBadge(dsr.type)}`}>{dsr.type}</span>
                                {dsr.priority === 'High' && <span className="badge badge-red">⚡ High Priority</span>}
                            </div>
                            <div className="flex items-center gap-3">
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deadline: {dsr.deadline}</span>
                                <span className={`badge ${dsr.status === 'completed' ? 'badge-green' : dsr.status === 'in-progress' ? 'badge-amber' : 'badge-cyan'}`}>{statusLabel(dsr.status)}</span>
                            </div>
                        </div>
                        <div className="grid-3" style={{ marginBottom: 'var(--space-4)' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Data Subject</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{dsr.subject_name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dsr.subject_email}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Data Locations</div>
                                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                    {(dsr.locations || []).map((loc, i) => (
                                        <span key={i} className="badge badge-violet" style={{ fontSize: '0.7rem' }}>{loc}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Submitted</div>
                                <div style={{ fontSize: '0.9rem' }}>{dsr.submitted_at}</div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between" style={{ marginBottom: 'var(--space-1)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fulfillment Progress</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dsr.progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: `${dsr.progress}%`, background: dsr.progress === 100 ? 'var(--accent-green)' : undefined }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
