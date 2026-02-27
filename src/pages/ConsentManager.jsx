import { useState, useEffect } from 'react'
import api from '../services/api'

const filters = ['All', 'Active', 'Pending', 'Expired', 'Revoked']

export default function ConsentManager() {
    const [records, setRecords] = useState([])
    const [stats, setStats] = useState({})
    const [activeFilter, setActiveFilter] = useState('All')
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ purpose: '', legal_basis: 'Consent', subjects: '', status: 'active', expires_at: '' })
    const [error, setError] = useState(null)
    const [creating, setCreating] = useState(false)
    const [showAI, setShowAI] = useState(false)
    const [aiPrompt, setAiPrompt] = useState('')
    const [aiResult, setAiResult] = useState(null)
    const [aiLoading, setAiLoading] = useState(false)

    const load = () => {
        Promise.all([api.getConsent(), api.getConsentStats()])
            .then(([r, s]) => { setRecords(r); setStats(s) })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const filtered = activeFilter === 'All' ? records : records.filter(r => r.status === activeFilter.toLowerCase())

    const handleCreate = async (e) => {
        e.preventDefault(); setCreating(true)
        try {
            await api.createConsent({ ...form, subjects: parseInt(form.subjects) || 0 })
            setShowForm(false); setForm({ purpose: '', legal_basis: 'Consent', subjects: '', status: 'active', expires_at: '' }); load()
        } catch (err) { setError(err.message) }
        finally { setCreating(false) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this consent record?')) return
        try { await api.deleteConsent(id); load() } catch (err) { setError(err.message) }
    }

    const handleAIGenerate = async (e) => {
        e.preventDefault(); if (!aiPrompt.trim()) return
        setAiLoading(true); setAiResult(null)
        try {
            const result = await api.generateConsentNotice({ purpose: aiPrompt, language: 'English', regulation: 'DPDPA 2023' })
            setAiResult(result)
        } catch (err) { setError(err.message) }
        finally { setAiLoading(false) }
    }

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Loading Consent Logic...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>Consent Orchestration</h1>
                    <p>Create, manage, and track consent records</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-secondary" onClick={() => { setShowAI(!showAI); setShowForm(false) }}>🧠 AI Notice</button>
                    <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setShowAI(false) }}>+ New Record</button>
                </div>
            </div>

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {/* AI Generator */}
            {showAI && (
                <div className="card card-highlight-violet mb-6 animate-fade-in">
                    <div className="card-header"><h3>🧠 AI Consent Notice Generator</h3></div>
                    <div className="card-body">
                        <p className="text-secondary mb-4" style={{ fontSize: '0.85rem' }}>Describe the processing activity and Gemini AI will generate a DPDPA-compliant consent notice.</p>
                        <form onSubmit={handleAIGenerate}>
                            <textarea className="form-textarea" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="We collect customer email addresses for marketing campaigns..." rows={3} required />
                            <button type="submit" className="btn btn-primary mt-4" disabled={aiLoading}>
                                {aiLoading ? '🔄 Generating...' : '🚀 Generate Notice'}
                            </button>
                        </form>
                        {aiResult && <div className="ai-output mt-4">{aiResult.notice || aiResult.content || JSON.stringify(aiResult, null, 2)}</div>}
                    </div>
                </div>
            )}

            {/* Create Form */}
            {showForm && (
                <div className="card card-highlight-cyan mb-6 animate-fade-in">
                    <div className="card-header"><h3>Create Consent Notice</h3></div>
                    <div className="card-body">
                        <form onSubmit={handleCreate} className="form-grid">
                            <div className="form-group"><label className="form-label">Purpose</label><input className="form-input" placeholder="e.g. Marketing" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Legal Basis</label><select className="form-select" value={form.legal_basis} onChange={(e) => setForm({ ...form, legal_basis: e.target.value })}><option>Consent</option><option>Legitimate Interest</option><option>Contract</option><option>Legal Obligation</option><option>Guardian Consent</option></select></div>
                            <div className="form-group"><label className="form-label">Subjects</label><input className="form-input" type="number" placeholder="Estimated" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Expiry</label><input className="form-input" type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} /></div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="kpi-grid mb-6">
                {[
                    { label: 'Total Notices', value: stats.total || 0 },
                    { label: 'Active', value: stats.active || 0, color: 'var(--accent-green)' },
                    { label: 'Pending', value: stats.pending || 0, color: 'var(--accent-amber)' },
                    { label: 'Expired/Revoked', value: stats.expired || 0, color: 'var(--accent-red)' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card">
                        <div className="kpi-top"><span className="kpi-label">{s.label}</span></div>
                        <div className="kpi-value" style={s.color ? { color: s.color } : undefined}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="filter-bar mb-6">
                {filters.map(f => (
                    <button key={f} className={`filter-btn ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
                ))}
            </div>

            {/* Table */}
            <div className="card">
                {filtered.length > 0 ? (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead><tr><th>Notice ID</th><th>Purpose</th><th>Subjects</th><th>Legal Basis</th><th>Status</th><th>Created</th><th>Expires</th><th></th></tr></thead>
                            <tbody>
                                {filtered.map((r) => (
                                    <tr key={r.id}>
                                        <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{r.notice_id}</td>
                                        <td>{r.purpose}</td>
                                        <td>{r.subjects?.toLocaleString()}</td>
                                        <td><span className="badge badge-violet">{r.legal_basis}</span></td>
                                        <td><span className={`badge ${r.status === 'active' ? 'badge-green' : r.status === 'pending' ? 'badge-amber' : 'badge-red'}`}>{r.status}</span></td>
                                        <td>{r.created_at}</td>
                                        <td>{r.expires_at || '—'}</td>
                                        <td><button className="btn-icon-danger" onClick={() => handleDelete(r.id)} title="Delete">✕</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state"><span className="empty-icon">📝</span><p>No records match this filter.</p></div>
                )}
            </div>
        </div>
    )
}
