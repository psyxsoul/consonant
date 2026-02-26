import { useState, useEffect } from 'react'
import api from '../services/api'

const filters = ['All', 'Active', 'Pending', 'Expired', 'Revoked']

export default function ConsentManager() {
    const [records, setRecords] = useState([])
    const [stats, setStats] = useState({})
    const [activeFilter, setActiveFilter] = useState('All')
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ purpose: '', legal_basis: 'Consent', subjects: 0, status: 'active', expires_at: '' })

    const load = () => {
        Promise.all([api.getConsent(), api.getConsentStats()])
            .then(([r, s]) => { setRecords(r); setStats(s) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const filtered = activeFilter === 'All'
        ? records
        : records.filter(r => r.status === activeFilter.toLowerCase())

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            await api.createConsent(form)
            setShowForm(false)
            setForm({ purpose: '', legal_basis: 'Consent', subjects: 0, status: 'active', expires_at: '' })
            load()
        } catch (err) { alert(err.message) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this consent record?')) return
        try { await api.deleteConsent(id); load() } catch (err) { alert(err.message) }
    }

    if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Consent Orchestration</h1>
                    <p className="page-header-subtitle">Verifiable consent records linked to every data asset</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Consent Notice</button>
            </div>

            {showForm && (
                <div className="dash-panel" style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Create Consent Notice</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <input placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <select value={form.legal_basis} onChange={(e) => setForm({ ...form, legal_basis: e.target.value })}
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                            <option>Consent</option><option>Legitimate Interest</option><option>Contract</option><option>Legal Obligation</option><option>Guardian Consent</option>
                        </select>
                        <input type="number" placeholder="Data Subjects" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: parseInt(e.target.value) || 0 })}
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 'var(--space-3)' }}>
                            <button type="submit" className="btn btn-primary">Create</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card"><div className="stat-card-value">{stats.total || 0}</div><div className="stat-card-label">Total Notices</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{stats.active || 0}</div><div className="stat-card-label">Active</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{stats.pending || 0}</div><div className="stat-card-label">Pending Review</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-red)' }}>{stats.expired || 0}</div><div className="stat-card-label">Expired / Revoked</div></div>
            </div>

            <div className="filter-bar">
                {filters.map(f => (
                    <button key={f} className={`filter-chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
                ))}
            </div>

            <div className="dash-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr><th>Notice ID</th><th>Purpose</th><th>Subjects</th><th>Legal Basis</th><th>Status</th><th>Created</th><th>Expires</th><th></th></tr>
                    </thead>
                    <tbody>
                        {filtered.map((r) => (
                            <tr key={r.id}>
                                <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{r.notice_id}</td>
                                <td style={{ color: 'var(--text-primary)' }}>{r.purpose}</td>
                                <td>{r.subjects?.toLocaleString()}</td>
                                <td><span className="badge badge-violet">{r.legal_basis}</span></td>
                                <td><span className={`status-dot ${r.status}`} /><span style={{ textTransform: 'capitalize' }}>{r.status}</span></td>
                                <td>{r.created_at}</td>
                                <td>{r.expires_at || '—'}</td>
                                <td><button className="btn btn-ghost" onClick={() => handleDelete(r.id)} style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>✕</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
