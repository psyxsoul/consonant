import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Guardrails() {
    const [guardrails, setGuardrails] = useState([])
    const [proxyLog, setProxyLog] = useState([])
    const [vaults, setVaults] = useState([])
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [toggling, setToggling] = useState(null)

    // AI Risk Assessment
    const [showAI, setShowAI] = useState(false)
    const [aiInput, setAiInput] = useState('')
    const [aiResult, setAiResult] = useState(null)
    const [aiLoading, setAiLoading] = useState(false)

    const load = () => {
        Promise.all([api.getGuardrails(), api.getGuardrailStats(), api.getProxyLog(), api.getVaults()])
            .then(([g, s, p, v]) => { setGuardrails(g); setStats(s); setProxyLog(p); setVaults(v) })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleToggle = async (id) => {
        setToggling(id)
        try {
            await api.toggleGuardrail(id)
            load()
        } catch (err) { setError(err.message) }
        finally { setToggling(null) }
    }

    const handleRiskAssessment = async (e) => {
        e.preventDefault()
        if (!aiInput.trim()) return
        setAiLoading(true)
        setAiResult(null)
        try {
            const result = await api.riskAssessment({ system_description: aiInput })
            setAiResult(result)
        } catch (err) { setError(err.message) }
        finally { setAiLoading(false) }
    }

    if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading guardrails...</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Active Guardrails</h1>
                    <p className="page-header-subtitle">Toggle defenses, view AI proxy logs, and run risk assessments</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAI(!showAI)}>🧠 AI Risk Assessment</button>
            </div>

            {error && (
                <div style={{ padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)', background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-red)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                    {error} <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}>✕</button>
                </div>
            )}

            {/* ===== AI RISK ASSESSMENT ===== */}
            {showAI && (
                <div className="dash-panel" style={{ borderLeft: '4px solid var(--accent-violet)', marginBottom: 'var(--space-6)' }}>
                    <div className="dash-panel-header"><h3>🧠 AI Risk Assessment</h3></div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>Describe your system/data flow and Gemini AI will assess privacy risks and recommend guardrails.</p>
                    <form onSubmit={handleRiskAssessment}>
                        <textarea value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                            placeholder="Example: We have a PostgreSQL database storing customer PII including Aadhaar numbers. Employees use ChatGPT for customer support and sometimes paste customer data into prompts. Data is backed up to S3 without encryption."
                            rows={4} required
                            style={{ width: '100%', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.85rem', resize: 'vertical' }} />
                        <button type="submit" className="btn btn-primary" disabled={aiLoading} style={{ marginTop: 'var(--space-3)' }}>
                            {aiLoading ? '🔄 Analyzing with Gemini...' : '🚀 Run Assessment'}
                        </button>
                    </form>
                    {aiResult && (
                        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {aiResult.assessment || aiResult.content || JSON.stringify(aiResult, null, 2)}
                        </div>
                    )}
                </div>
            )}

            {/* ===== STATS ===== */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card"><div className="stat-card-value">{stats.total || 0}</div><div className="stat-card-label">Total Guardrails</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{stats.active || 0}</div><div className="stat-card-label">Active</div></div>
                <div className="stat-card"><div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>{stats.totalRedacted || 0}</div><div className="stat-card-label">Fields Redacted</div></div>
                <div className="stat-card"><div className="stat-card-value">{stats.vaultCount || 0}</div><div className="stat-card-label">Privacy Vaults</div></div>
            </div>

            <div className="grid-2">
                <div>
                    <div className="dash-panel">
                        <div className="dash-panel-header"><h3>Defense Configuration</h3><span className="badge badge-green">● Live</span></div>
                        {guardrails.map((g) => (
                            <div className="guardrail-card" key={g.id}>
                                <div className={`guardrail-status ${g.is_active ? 'active' : 'inactive'}`} />
                                <div className="guardrail-info">
                                    <h4>{g.name}</h4>
                                    <p>{g.description}</p>
                                    <span className="badge badge-violet" style={{ marginTop: 4, fontSize: '0.65rem' }}>{g.category}</span>
                                </div>
                                <div
                                    className={`guardrail-toggle ${g.is_active ? 'on' : ''}`}
                                    onClick={() => handleToggle(g.id)}
                                    style={{ cursor: toggling === g.id ? 'wait' : 'pointer', opacity: toggling === g.id ? 0.5 : 1 }}
                                    title={g.is_active ? 'Click to deactivate' : 'Click to activate'}
                                />
                            </div>
                        ))}
                        {guardrails.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: 'var(--space-4)' }}>No guardrails configured.</p>}
                    </div>
                </div>

                <div>
                    <div className="dash-panel">
                        <div className="dash-panel-header">
                            <h3>AI Proxy Redaction Log</h3>
                            <span className="badge badge-green">● Live</span>
                        </div>
                        {proxyLog.map((entry, i) => (
                            <div className="activity-item" key={entry.id || i}>
                                <span className="activity-dot cyan" />
                                <div style={{ flex: 1 }}>
                                    <div className="activity-text">
                                        <strong>{entry.user_name}</strong> → {entry.model}
                                        <span style={{ marginLeft: 8 }} className="badge badge-red">{entry.fields_redacted} redacted</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                                        {(typeof entry.redacted_types === 'string' ? JSON.parse(entry.redacted_types) : entry.redacted_types || []).map((t, j) => (
                                            <span key={j} className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{t}</span>
                                        ))}
                                    </div>
                                    <div className="activity-time">{entry.time}</div>
                                </div>
                            </div>
                        ))}
                        {proxyLog.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: 'var(--space-4)' }}>No proxy activity yet.</p>}
                    </div>

                    <div className="dash-panel">
                        <div className="dash-panel-header"><h3>Privacy Vaults</h3></div>
                        {vaults.map((v) => (
                            <div className="guardrail-card" key={v.id}>
                                <div style={{ width: 40, height: 40, minWidth: 40, borderRadius: 'var(--radius-sm)', background: 'var(--accent-violet-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🔒</div>
                                <div className="guardrail-info" style={{ flex: 1 }}>
                                    <h4>{v.name}</h4>
                                    <p>{v.records?.toLocaleString()} records · {v.size} · Last: {v.last_access}</p>
                                </div>
                                <span className="badge badge-green">🔐 Encrypted</span>
                            </div>
                        ))}
                        {vaults.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: 'var(--space-4)' }}>No vaults configured.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}
