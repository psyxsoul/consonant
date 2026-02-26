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

    // AI Consent Notice Generation
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

    const filtered = activeFilter === 'All'
        ? records
        : records.filter(r => r.status === activeFilter.toLowerCase())

    const handleCreate = async (e) => {
        e.preventDefault()
        setCreating(true)
        try {
            await api.createConsent({ ...form, subjects: parseInt(form.subjects) || 0 })
            setShowForm(false)
            setForm({ purpose: '', legal_basis: 'Consent', subjects: '', status: 'active', expires_at: '' })
            load()
        } catch (err) { setError(err.message) }
        finally { setCreating(false) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this consent record?')) return
        try { await api.deleteConsent(id); load() } catch (err) { setError(err.message) }
    }

    const handleAIGenerate = async (e) => {
        e.preventDefault()
        if (!aiPrompt.trim()) return
        setAiLoading(true)
        setAiResult(null)
        try {
            const result = await api.generateConsentNotice({ purpose: aiPrompt, language: 'English', regulation: 'DPDPA 2023' })
            setAiResult(result)
        } catch (err) { setError(err.message) }
        finally { setAiLoading(false) }
    }

    if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading consent data...</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Consent Orchestration</h1>
                    <p className="page-header-subtitle">Create, manage, and track consent records — linked to every data asset</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button className="btn btn-secondary" onClick={() => { setShowAI(!showAI); setShowForm(false) }}>🧠 AI Generate Notice</button>
                    <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setShowAI(false) }}>+ New Consent Record</button>
                </div>
            </div>

            {error && (
                <div style={{ padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)', background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-red)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {error}
                    <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontWeight: 700 }}>✕</button>
                </div>
            )}

            {/* ===== AI CONSENT NOTICE GENERATOR ===== */}
            {showAI && (
                <div className="dash-panel" style={{ borderLeft: '4px solid var(--accent-violet)', marginBottom: 'var(--space-6)' }}>
                    <div className="dash-panel-header">
                        <h3>🧠 AI Consent Notice Generator</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>Describe the processing activity and Gemini AI will generate a DPDPA-compliant consent notice.</p>
                    <form onSubmit={handleAIGenerate}>
                        <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Example: We collect customer email addresses and phone numbers for marketing campaigns and share them with our CRM partner Salesforce."
                            rows={3} required
                            style={{ width: '100%', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.85rem', resize: 'vertical' }} />
                        <button type="submit" className="btn btn-primary" disabled={aiLoading} style={{ marginTop: 'var(--space-3)' }}>
                            {aiLoading ? '🔄 Generating with Gemini...' : '🚀 Generate Notice'}
                        </button>
                    </form>
                    {aiResult && (
                        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {aiResult.notice || aiResult.content || JSON.stringify(aiResult, null, 2)}
                        </div>
                    )}
                </div>
            )}

            {/* ===== CREATE FORM ===== */}
            {showForm && (
                <div className="dash-panel" style={{ borderLeft: '4px solid var(--accent-cyan)', marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Create Consent Notice</h3>
                    <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <input placeholder="Purpose (e.g. Marketing Communications)" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <select value={form.legal_basis} onChange={(e) => setForm({ ...form, legal_basis: e.target.value })}
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                            <option>Consent</option><option>Legitimate Interest</option><option>Contract</option><option>Legal Obligation</option><option>Guardian Consent</option>
                        </select>
                        <input type="number" placeholder="Number of Data Subjects" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} placeholder="Expiry Date"
                            style={{ padding: 'var(--space-3)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }} />
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 'var(--space-3)' }}>
                            <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Create Consent Record'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* ===== STATS ===== */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card"><div className="stat-card-value">{stats.total || 0}</div><div className="stat-card-label">Total Notices</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{stats.active || 0}</div><div className="stat-card-label">Active</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{stats.pending || 0}</div><div className="stat-card-label">Pending Review</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-red)' }}>{stats.expired || 0}</div><div className="stat-card-label">Expired / Revoked</div></div>
            </div>

            {/* ===== FILTER BAR ===== */}
            <div className="filter-bar">
                {filters.map(f => (
                    <button key={f} className={`filter-chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
                ))}
            </div>

            {/* ===== TABLE ===== */}
            <div className="dash-panel" style={{ padding: 0, overflow: 'hidden' }}>
                {filtered.length > 0 ? (
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
                                    <td><span className={`badge ${r.status === 'active' ? 'badge-green' : r.status === 'pending' ? 'badge-amber' : 'badge-red'}`}>{r.status}</span></td>
                                    <td>{r.created_at}</td>
                                    <td>{r.expires_at || '—'}</td>
                                    <td><button className="btn btn-ghost" onClick={() => handleDelete(r.id)} style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }} title="Delete">✕</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>No records match this filter.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
