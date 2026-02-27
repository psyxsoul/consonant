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

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const progress = newStatus === 'completed' ? 100 : newStatus === 'in-progress' ? 50 : 20
            await api.updateDSR(id, { status: newStatus, progress }); load()
        } catch (err) { setError(err.message) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this DSR?')) return
        try { await api.deleteDSR(id); load() } catch (err) { setError(err.message) }
    }

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Loading DSR data...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>DSR Management</h1>
                    <p>Track and fulfill Data Subject Rights requests</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Request</button>
            </div>

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {showForm && (
                <div className="card card-highlight-amber mb-6 animate-fade-in">
                    <div className="card-header"><h3>Log New DSR Request</h3></div>
                    <div className="card-body">
                        <form onSubmit={handleCreate} className="form-grid">
                            <div className="form-group"><label className="form-label">Subject Name</label><input className="form-input" placeholder="Name" value={form.subject_name} onChange={(e) => setForm({ ...form, subject_name: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Subject Email</label><input className="form-input" type="email" placeholder="Email" value={form.subject_email} onChange={(e) => setForm({ ...form, subject_email: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Erasure</option><option>Access</option><option>Portability</option><option>Rectification</option></select></div>
                            <div className="form-group"><label className="form-label">Priority</label><select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>High</option><option>Medium</option><option>Low</option></select></div>
                            <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button><button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button></div>
                        </form>
                    </div>
                </div>
            )}

            <div className="kpi-grid mb-6">
                {[
                    { label: 'Total Requests', value: stats.total || 0 },
                    { label: 'In Progress', value: stats.inProgress || 0, color: 'var(--accent-amber)' },
                    { label: 'Pending', value: stats.pending || 0, color: 'var(--accent-cyan)' },
                    { label: 'Completed', value: stats.completed || 0, color: 'var(--accent-green)' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card"><div className="kpi-top"><span className="kpi-label">{s.label}</span></div><div className="kpi-value" style={s.color ? { color: s.color } : undefined}>{s.value}</div></div>
                ))}
            </div>

            {/* DSR Cards */}
            <div className="dsr-list">
                {requests.map((dsr) => (
                    <div key={dsr.id} className="card dsr-card">
                        <div className="dsr-card-top">
                            <div className="flex items-center gap-3">
                                <span className="dsr-id">{dsr.request_id}</span>
                                <span className={`badge ${typeBadge(dsr.type)}`}>{dsr.type}</span>
                                {dsr.priority === 'High' && <span className="badge badge-red">⚡ High</span>}
                            </div>
                            <div className="flex items-center gap-3">
                                <select className="form-select form-select-sm" value={dsr.status} onChange={(e) => handleUpdateStatus(dsr.id, e.target.value)}>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                <button className="btn-icon-danger" onClick={() => handleDelete(dsr.id)}>✕</button>
                            </div>
                        </div>
                        <div className="dsr-card-meta">
                            <div className="dsr-meta-item">
                                <span className="dsr-meta-label">Subject</span>
                                <span className="dsr-meta-value">{dsr.subject_name}</span>
                                <span className="dsr-meta-sub">{dsr.subject_email}</span>
                            </div>
                            <div className="dsr-meta-item">
                                <span className="dsr-meta-label">Deadline</span>
                                <span className="dsr-meta-value">{dsr.deadline}</span>
                            </div>
                            <div className="dsr-meta-item">
                                <span className="dsr-meta-label">Submitted</span>
                                <span className="dsr-meta-value">{dsr.submitted_at}</span>
                            </div>
                        </div>
                        <div className="dsr-progress">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Progress</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{dsr.progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: `${dsr.progress}%`, background: dsr.progress === 100 ? 'var(--accent-green)' : undefined }} />
                            </div>
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <div className="empty-state"><span className="empty-icon">📋</span><p>No DSR requests yet.</p></div>
                )}
            </div>
        </div>
    )
}
