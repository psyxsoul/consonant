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

    if (loading) return (
        <div className="flex-col items-center justify-center animate-fade-in" style={{ height: '60vh', color: 'var(--text-muted)' }}>
            <div className="text-center">
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-green-dim)', borderTopColor: 'var(--accent-green)', borderRadius: '50%', animation: 'rotate 1s linear infinite', margin: '0 auto 16px' }} />
                <span>Loading Guardrails...</span>
            </div>
        </div>
    )

    return (
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="page-header flex justify-between items-end mb-8">
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Active Guardrails</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Toggle defenses, view AI proxy logs, and run risk assessments</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAI(!showAI)}>🧠 AI Risk Assessment</button>
            </div>

            {error && (
                <div className="p-4 mb-6 flex justify-between items-center" style={{ background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--accent-red)', fontSize: '0.9rem' }}>
                    {error} <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                </div>
            )}

            {/* ===== AI RISK ASSESSMENT ===== */}
            {showAI && (
                <div className="glass-card mb-8 animate-fade-in" style={{ borderLeft: '4px solid var(--accent-violet)' }}>
                    <div className="mb-4">
                        <h3 style={{ fontSize: '1.2rem' }}>🧠 AI Risk Assessment</h3>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>Describe your system/data flow and Gemini AI will assess privacy risks and recommend guardrails.</p>
                    <form onSubmit={handleRiskAssessment}>
                        <textarea className="form-textarea" value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                            placeholder="Example: We have a PostgreSQL database storing customer PII including Aadhaar numbers. Employees use ChatGPT for customer support and sometimes paste customer data into prompts. Data is backed up to S3 without encryption."
                            rows={4} required
                            style={{ fontSize: '0.9rem' }} />
                        <button type="submit" className="btn btn-primary mt-4" disabled={aiLoading}>
                            {aiLoading ? '🔄 Analyzing with Gemini...' : '🚀 Run Assessment'}
                        </button>
                    </form>
                    {aiResult && (
                        <div className="mt-6 p-4" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, border: '1px solid var(--border-default)' }}>
                            {aiResult.assessment || aiResult.content || JSON.stringify(aiResult, null, 2)}
                        </div>
                    )}
                </div>
            )}

            {/* ===== STATS ===== */}
            <div className="grid-4 mb-8">
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{stats.total || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Total Guardrails</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>{stats.active || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Active Defenses</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)', lineHeight: 1 }}>{stats.totalRedacted || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Fields Redacted</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-violet)', lineHeight: 1 }}>{stats.vaultCount || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Privacy Vaults</div>
                </div>
            </div>

            <div className="grid-2" style={{ gap: 'var(--space-6)', alignItems: 'start' }}>
                <div className="flex-col gap-6">
                    <div className="glass-card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 style={{ fontSize: '1.2rem' }}>Defense Configuration</h3>
                            <span className="badge badge-green">● Live</span>
                        </div>
                        {guardrails.map((g) => (
                            <div className="flex items-center gap-4 p-4 mb-4" key={g.id} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                                <div className={`guardrail-status ${g.is_active ? 'active' : 'inactive'}`} />
                                <div className="flex-col" style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 4 }}>{g.name}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 6 }}>{g.description}</p>
                                    <div><span className="badge badge-violet">{g.category}</span></div>
                                </div>
                                <div
                                    className={`guardrail-toggle ${g.is_active ? 'on' : ''}`}
                                    onClick={() => handleToggle(g.id)}
                                    style={{ cursor: toggling === g.id ? 'wait' : 'pointer', opacity: toggling === g.id ? 0.5 : 1, width: 44, height: 24, borderRadius: 12, background: g.is_active ? 'var(--accent-green)' : 'var(--bg-secondary)', position: 'relative', transition: 'background 0.3s ease', border: '1px solid var(--border-subtle)' }}
                                    title={g.is_active ? 'Click to deactivate' : 'Click to activate'}
                                >
                                    <div style={{ position: 'absolute', top: 2, left: g.is_active ? 22 : 2, width: 18, height: 18, borderRadius: '50%', background: 'var(--text-primary)', transition: 'left 0.3s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                                </div>
                            </div>
                        ))}
                        {guardrails.length === 0 && <p className="text-center p-6" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No guardrails configured.</p>}
                    </div>
                </div>

                <div className="flex-col gap-6">
                    <div className="glass-card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 style={{ fontSize: '1.2rem' }}>AI Proxy Redaction Log</h3>
                            <span className="badge badge-green">● Live</span>
                        </div>
                        <div className="flex-col gap-4">
                            {proxyLog.map((entry, i) => (
                                <div className="flex items-start gap-4 p-4" key={entry.id || i} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-cyan)', marginTop: 8, boxShadow: '0 0 8px var(--accent-cyan)' }} />
                                    <div className="flex-col" style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 6 }}>
                                            <strong style={{ color: 'var(--accent-cyan)' }}>{entry.user_name}</strong> → {entry.model}
                                            <span style={{ marginLeft: 8 }} className="badge badge-red">{entry.fields_redacted} redacted</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {(typeof entry.redacted_types === 'string' ? JSON.parse(entry.redacted_types) : entry.redacted_types || []).map((t, j) => (
                                                <span key={j} className="badge badge-cyan">{t}</span>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.time}</div>
                                    </div>
                                </div>
                            ))}
                            {proxyLog.length === 0 && <p className="text-center p-6" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No proxy activity yet.</p>}
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="mb-6" style={{ fontSize: '1.2rem' }}>Privacy Vaults</h3>
                        <div className="flex-col gap-4">
                            {vaults.map((v) => (
                                <div className="flex items-center gap-4 p-4" key={v.id} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                                    <div className="flex-center" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-violet-dim)', fontSize: '1.2rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>🔒</div>
                                    <div className="flex-col" style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 4 }}>{v.name}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{v.records?.toLocaleString()} records · {v.size} · Last: {v.last_access}</p>
                                    </div>
                                    <span className="badge badge-green">🔐 Encrypted</span>
                                </div>
                            ))}
                            {vaults.length === 0 && <p className="text-center p-6" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No vaults configured.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
