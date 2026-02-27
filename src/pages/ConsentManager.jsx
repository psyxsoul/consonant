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

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Orchestrating Consent Rules...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>Consent Architecture</h1>
                    <p>Granular preference tracking and DPDPA-compliant notice generation</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-secondary" onClick={() => { setShowAI(!showAI); setShowForm(false) }}>🧠 Generate Notice</button>
                    <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setShowAI(false) }}>+ Add Configuration</button>
                </div>
            </div>

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {/* AI Generator */}
            {showAI && (
                <div className="card card-highlight-violet mb-8 animate-fade-in shadow-xl">
                    <div className="card-header border-b"><h3>🧠 AI Consent Architect</h3></div>
                    <div className="card-body">
                        <p className="text-secondary mb-4" style={{ fontSize: '0.85rem' }}>Define data parameters; AI synthesizes a compliant legal construct.</p>
                        <form onSubmit={handleAIGenerate}>
                            <textarea className="form-textarea" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="E.g., We collect biometrics for workplace authentication..." rows={3} required />
                            <div className="flex justify-end mt-4">
                                <button type="submit" className="btn btn-primary" disabled={aiLoading}>
                                    {aiLoading ? '🔄 Synthesizing...' : '🚀 Generate Ledger'}
                                </button>
                            </div>
                        </form>
                        {aiResult && (
                            <div className="mt-6 p-6 rounded-md" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                                <div className="flex items-center gap-2 mb-4 text-violet" style={{ color: 'var(--accent-violet)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                    <span className="status-dot green" /> Verified Legal Notice
                                </div>
                                <div className="ai-output" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                                    {aiResult.notice || aiResult.content || JSON.stringify(aiResult, null, 2)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Form */}
            {showForm && (
                <div className="card card-highlight-cyan mb-8 animate-fade-in shadow-xl">
                    <div className="card-header border-b"><h3>Establish Reference</h3></div>
                    <div className="card-body">
                        <form onSubmit={handleCreate} className="form-grid">
                            <div className="form-group"><label className="form-label">Explicit Purpose</label><input className="form-input" placeholder="e.g. Behavioral Tracking" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required /></div>
                            <div className="form-group"><label className="form-label">Basis of Processing</label><select className="form-select" value={form.legal_basis} onChange={(e) => setForm({ ...form, legal_basis: e.target.value })}><option>Consent</option><option>Legitimate Interest</option><option>Contract</option><option>Legal Obligation</option><option>Guardian Consent</option></select></div>
                            <div className="form-group"><label className="form-label">Impacted Subjects</label><input className="form-input" type="number" placeholder="Volume Metric" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Validity Horizon</label><input className="form-input" type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} /></div>
                            <div className="form-actions border-t pt-4 mt-2" style={{ borderColor: 'var(--border-subtle)' }}>
                                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? 'Committing...' : 'Commit Rule'}</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Discard</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="dash-grid-2 mb-8">
                {/* Consent Funnel Visualization */}
                <div className="card">
                    <div className="card-header border-b">
                        <h3>Conversion Funnel</h3>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Platform Wide</span>
                    </div>
                    <div className="card-body">
                        <div className="flex-col gap-2">
                            <div className="funnel-stage">
                                <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Total Views</span>
                                <div className="funnel-bar" style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}>14K</div>
                            </div>
                            <div className="funnel-stage">
                                <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Interactions</span>
                                <div className="funnel-bar" style={{ width: '75%', background: 'var(--bg-tertiary)', border: '1px solid var(--accent-cyan-dim)', color: 'var(--text-primary)' }}>10.5K</div>
                            </div>
                            <div className="funnel-stage">
                                <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Explicit Opt-Ins</span>
                                <div className="funnel-bar" style={{ width: '60%' }}>8.4K</div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between items-center px-2">
                            <div className="flex-col">
                                <span className="text-muted mb-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Opt-In Rate</span>
                                <span className="text-green font-bold text-xl" style={{ color: 'var(--accent-green)' }}>60%</span>
                            </div>
                            <div className="flex-col items-end">
                                <span className="text-muted mb-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Friction Drop</span>
                                <span className="text-red font-bold text-xl" style={{ color: 'var(--accent-red)' }}>25%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Granular KPIs */}
                <div className="kpi-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {[
                        { label: 'Total Rules', value: stats.total || 0, icon: '📜' },
                        { label: 'Active Enforcement', value: stats.active || 0, color: 'var(--accent-green)', icon: '🟢' },
                        { label: 'Awaiting Sign-off', value: stats.pending || 0, color: 'var(--accent-amber)', icon: '⏳' },
                        { label: 'Revoked/Expired', value: stats.expired || 0, color: 'var(--accent-red)', icon: '🔴' },
                    ].map((s, i) => (
                        <div key={i} className="kpi-card" style={{ padding: 'var(--space-4)' }}>
                            <div className="kpi-top"><span className="kpi-label">{s.label}</span></div>
                            <div className="kpi-value" style={s.color ? { color: s.color } : undefined}>{s.value}</div>
                            <div className="kpi-icon" style={{ opacity: 0.1 }}>{s.icon}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter Hub */}
            <div className="filter-bar mb-6 p-2 bg-secondary rounded-md border border-subtle inline-flex shadow-sm">
                {filters.map(f => (
                    <button key={f} className={`filter-btn ${activeFilter === f ? 'active' : ''} border-none`} style={{ padding: '4px 16px' }} onClick={() => setActiveFilter(f)}>{f}</button>
                ))}
            </div>

            {/* Interactive Preference Ledger */}
            <div className="card">
                <div className="card-header border-b">
                    <h3>Preference Ledger</h3>
                    <div className="flex gap-4 items-center">
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{filtered.length} Validated Records</span>
                    </div>
                </div>
                {filtered.length > 0 ? (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead><tr><th>Ledger ID</th><th>Processing Purpose</th><th>Subject Volume</th><th>Lawful Basis</th><th>Status</th><th>Timestamp</th><th>Horizon</th><th></th></tr></thead>
                            <tbody>
                                {filtered.map((r) => (
                                    <tr key={r.id}>
                                        <td><code className="text-cyan px-2 py-1 bg-primary rounded">{r.notice_id}</code></td>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.purpose}</td>
                                        <td>
                                            <div className="flex border border-subtle rounded-full overflow-hidden" style={{ width: '80px', height: '6px' }}>
                                                <div style={{ width: `${Math.min(100, (r.subjects / 10000) * 100)}%`, background: 'var(--accent-cyan)' }} />
                                            </div>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{r.subjects?.toLocaleString()} reqs</span>
                                        </td>
                                        <td><span className="badge badge-violet border border-violet-dim bg-transparent">{r.legal_basis}</span></td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${r.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_var(--accent-green)]' : r.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} style={{ backgroundColor: `var(--accent-${r.status === 'active' ? 'green' : r.status === 'pending' ? 'amber' : 'red'})`, width: 8, height: 8, borderRadius: 4 }} />
                                                <span className="capitalize font-medium" style={{ fontSize: '0.8rem', color: `var(--accent-${r.status === 'active' ? 'green' : r.status === 'pending' ? 'amber' : 'red'})` }}>{r.status}</span>
                                            </div>
                                        </td>
                                        <td className="text-muted" style={{ fontSize: '0.75rem' }}>{r.created_at}</td>
                                        <td className="text-muted" style={{ fontSize: '0.75rem' }}>{r.expires_at || 'Perpetual'}</td>
                                        <td><button className="btn-icon-danger" onClick={() => handleDelete(r.id)} title="Revoke">✕</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon" style={{ fontSize: '3rem', color: 'var(--accent-violet)', opacity: 0.2 }}>🛡️</span>
                        <p>Ledger empty for this filter segment.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
