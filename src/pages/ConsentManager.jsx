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

    if (loading) return (
        <div className="flex-col items-center justify-center animate-fade-in" style={{ height: '60vh', color: 'var(--text-muted)' }}>
            <div className="text-center">
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-violet-dim)', borderTopColor: 'var(--accent-violet)', borderRadius: '50%', animation: 'rotate 1s linear infinite', margin: '0 auto 16px' }} />
                <span>Loading Consent Logic...</span>
            </div>
        </div>
    )

    return (
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="page-header flex justify-between items-end mb-8">
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Consent Orchestration</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Create, manage, and track consent records — linked to every data asset</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-secondary" onClick={() => { setShowAI(!showAI); setShowForm(false) }}>🧠 AI Generate Notice</button>
                    <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setShowAI(false) }}>+ New Consent Record</button>
                </div>
            </div>

            {error && (
                <div className="p-4 mb-6 flex justify-between items-center" style={{ background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--accent-red)', fontSize: '0.9rem' }}>
                    {error}
                    <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontWeight: 700 }}>✕</button>
                </div>
            )}

            {/* ===== AI CONSENT NOTICE GENERATOR ===== */}
            {showAI && (
                <div className="glass-card mb-8 animate-fade-in" style={{ borderLeft: '4px solid var(--accent-violet)' }}>
                    <div className="mb-4">
                        <h3 style={{ fontSize: '1.2rem' }}>🧠 AI Consent Notice Generator</h3>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>Describe the processing activity and Gemini AI will generate a DPDPA-compliant consent notice.</p>
                    <form onSubmit={handleAIGenerate}>
                        <textarea className="form-textarea" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Example: We collect customer email addresses and phone numbers for marketing campaigns and share them with our CRM partner Salesforce."
                            rows={3} required
                            style={{ fontSize: '0.9rem' }} />
                        <button type="submit" className="btn btn-primary mt-4" disabled={aiLoading}>
                            {aiLoading ? '🔄 Generating with Gemini...' : '🚀 Generate Notice'}
                        </button>
                    </form>
                    {aiResult && (
                        <div className="mt-6 p-4" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, border: '1px solid var(--border-default)' }}>
                            {aiResult.notice || aiResult.content || JSON.stringify(aiResult, null, 2)}
                        </div>
                    )}
                </div>
            )}

            {/* ===== CREATE FORM ===== */}
            {showForm && (
                <div className="glass-card mb-8 animate-fade-in" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
                    <h3 className="mb-6" style={{ fontSize: '1.2rem' }}>Create Consent Notice</h3>
                    <form onSubmit={handleCreate} className="grid-2">
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Purpose</label>
                            <input className="form-input" placeholder="e.g. Marketing Communications" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Legal Basis</label>
                            <select className="form-select" value={form.legal_basis} onChange={(e) => setForm({ ...form, legal_basis: e.target.value })}>
                                <option>Consent</option><option>Legitimate Interest</option><option>Contract</option><option>Legal Obligation</option><option>Guardian Consent</option>
                            </select>
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Number of Subjects</label>
                            <input className="form-input" type="number" placeholder="Estimated Impact" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expiry Date</label>
                            <input className="form-input" type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} placeholder="Expiry Date" />
                        </div>
                        <div className="flex gap-4 mt-4" style={{ gridColumn: '1 / -1' }}>
                            <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Create Consent Record'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* ===== STATS ===== */}
            <div className="grid-4 mb-8">
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stats.total || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Total Notices</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>{stats.active || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Active Consents</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-amber)', lineHeight: 1 }}>{stats.pending || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Pending Review</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-red)', lineHeight: 1 }}>{stats.expired || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Expired / Revoked</div>
                </div>
            </div>

            {/* ===== FILTER BAR ===== */}
            <div className="flex gap-2 mb-6" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                {filters.map(f => (
                    <button key={f} className={`btn ${activeFilter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveFilter(f)} style={{ padding: '8px 16px', borderRadius: '100px' }}>{f}</button>
                ))}
            </div>

            {/* ===== TABLE ===== */}
            <div className="glass-card p-0" style={{ overflow: 'hidden' }}>
                {filtered.length > 0 ? (
                    <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
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
                    </div>
                ) : (
                    <div className="p-10 text-center" style={{ color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📝</p>
                        <p style={{ fontSize: '1.1rem' }}>No records match this filter.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
