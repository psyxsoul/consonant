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
        try { await api.toggleGuardrail(id); load() }
        catch (err) { setError(err.message) }
        finally { setToggling(null) }
    }

    const handleRiskAssessment = async (e) => {
        e.preventDefault(); if (!aiInput.trim()) return
        setAiLoading(true); setAiResult(null)
        try {
            const result = await api.riskAssessment({ system_description: aiInput })
            setAiResult(result)
        } catch (err) { setError(err.message) }
        finally { setAiLoading(false) }
    }

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Loading Guardrails...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>Active Guardrails</h1>
                    <p>Toggle defenses, view proxy logs, and run risk assessments</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAI(!showAI)}>🧠 AI Assessment</button>
            </div>

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {showAI && (
                <div className="card card-highlight-violet mb-6 animate-fade-in">
                    <div className="card-header"><h3>🧠 AI Risk Assessment</h3></div>
                    <div className="card-body">
                        <p className="text-secondary mb-4" style={{ fontSize: '0.85rem' }}>Describe your system and Gemini AI will assess privacy risks.</p>
                        <form onSubmit={handleRiskAssessment}>
                            <textarea className="form-textarea" value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                                placeholder="Describe your data processing system..." rows={4} required />
                            <button type="submit" className="btn btn-primary mt-4" disabled={aiLoading}>
                                {aiLoading ? '🔄 Analyzing...' : '🚀 Run Assessment'}
                            </button>
                        </form>
                        {aiResult && <div className="ai-output mt-4">{aiResult.assessment || aiResult.content || JSON.stringify(aiResult, null, 2)}</div>}
                    </div>
                </div>
            )}

            <div className="kpi-grid mb-6">
                {[
                    { label: 'Total Guardrails', value: stats.total || 0 },
                    { label: 'Active', value: stats.active || 0, color: 'var(--accent-green)' },
                    { label: 'Fields Redacted', value: stats.totalRedacted || 0, color: 'var(--accent-cyan)' },
                    { label: 'Privacy Vaults', value: stats.vaultCount || 0, color: 'var(--accent-violet)' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card"><div className="kpi-top"><span className="kpi-label">{s.label}</span></div><div className="kpi-value" style={s.color ? { color: s.color } : undefined}>{s.value}</div></div>
                ))}
            </div>

            <div className="dash-grid-2">
                {/* Defense Config */}
                <div className="card">
                    <div className="card-header">
                        <h3>Defenses</h3>
                        <span className="status-dot green">Live</span>
                    </div>
                    <div className="card-body guardrail-list">
                        {guardrails.map((g) => (
                            <div className="guardrail-item" key={g.id}>
                                <div className={`guardrail-dot ${g.is_active ? 'on' : ''}`} />
                                <div className="guardrail-info">
                                    <h4>{g.name}</h4>
                                    <p>{g.description}</p>
                                    <span className="badge badge-violet">{g.category}</span>
                                </div>
                                <div
                                    className={`toggle ${g.is_active ? 'on' : ''}`}
                                    onClick={() => handleToggle(g.id)}
                                    style={{ opacity: toggling === g.id ? 0.5 : 1 }}
                                >
                                    <div className="toggle-knob" />
                                </div>
                            </div>
                        ))}
                        {guardrails.length === 0 && <p className="text-muted text-center p-6">No guardrails configured.</p>}
                    </div>
                </div>

                {/* Right column */}
                <div className="dash-right-col">
                    {/* Proxy Log */}
                    <div className="card">
                        <div className="card-header">
                            <h3>AI Proxy Log</h3>
                            <span className="status-dot green">Live</span>
                        </div>
                        <div className="card-body proxy-list">
                            {proxyLog.map((entry, i) => (
                                <div className="proxy-item" key={entry.id || i}>
                                    <div className="proxy-dot" />
                                    <div className="proxy-info">
                                        <div className="proxy-header">
                                            <strong className="text-cyan">{entry.user_name}</strong> → {entry.model}
                                            <span className="badge badge-red ml-auto">{entry.fields_redacted} redacted</span>
                                        </div>
                                        <div className="proxy-types">
                                            {(typeof entry.redacted_types === 'string' ? JSON.parse(entry.redacted_types) : entry.redacted_types || []).map((t, j) => (
                                                <span key={j} className="badge badge-cyan">{t}</span>
                                            ))}
                                        </div>
                                        <span className="proxy-time">{entry.time}</span>
                                    </div>
                                </div>
                            ))}
                            {proxyLog.length === 0 && <p className="text-muted text-center p-6">No proxy activity.</p>}
                        </div>
                    </div>

                    {/* Vaults */}
                    <div className="card">
                        <div className="card-header"><h3>Privacy Vaults</h3></div>
                        <div className="card-body vault-list">
                            {vaults.map((v) => (
                                <div className="vault-item" key={v.id}>
                                    <div className="vault-icon">🔒</div>
                                    <div className="vault-info">
                                        <h4>{v.name}</h4>
                                        <p>{v.records?.toLocaleString()} records · {v.size} · Last: {v.last_access}</p>
                                    </div>
                                    <span className="badge badge-green">🔐 Encrypted</span>
                                </div>
                            ))}
                            {vaults.length === 0 && <p className="text-muted text-center p-6">No vaults configured.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
