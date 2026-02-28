import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Guardrails() {
    const [config, setConfig] = useState({})
    const [vaults, setVaults] = useState([])
    const [proxyLog, setProxyLog] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ payload: '', context: 'LLM Prompt' })
    const [aiResult, setAiResult] = useState(null)
    const [aiLoading, setAiLoading] = useState(false)

    const load = () => {
        Promise.all([
            api.getGuardrails(),
            api.getVaults(),
            api.getProxyLog()
        ]).then(([c, v, p]) => {
            setConfig(c)
            setVaults(v)
            setProxyLog(p)
        }).catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const toggle = async (key) => {
        try {
            const res = await api.toggleGuardrail(key, { enabled: !config[key] })
            setConfig(res.config)
        } catch (err) { setError(err.message) }
    }

    const handleAssess = async (e) => {
        e.preventDefault(); if (!form.payload.trim()) return
        setAiLoading(true); setAiResult(null)
        try {
            const result = await api.riskAssessment(form)
            setAiResult(result); load()
        } catch (err) { setError(err.message) }
        finally { setAiLoading(false) }
    }

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Arming Privacy Firewalls...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>Active Defense Posture</h1>
                    <p>Real-time redaction, contextual filtering, and privacy vaults</p>
                </div>
                <button className="btn btn-secondary" onClick={() => setShowForm(!showForm)}>⚡ Test Interceptor</button>
            </div>

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {showForm && (
                <div className="card card-highlight-red mb-8 animate-fade-in shadow-xl">
                    <div className="card-header border-b"><h3>Interceptor Sandbox</h3></div>
                    <div className="card-body">
                        <p className="text-secondary mb-4" style={{ fontSize: '0.85rem' }}>Send a raw payload. The Guardrail Proxy will intercept, assess, and redact it.</p>
                        <form onSubmit={handleAssess}>
                            <div className="form-group mb-4">
                                <label className="form-label">Injection Context</label>
                                <select className="form-select" value={form.context} onChange={e => setForm({ ...form, context: e.target.value })}>
                                    <option>LLM Prompt</option>
                                    <option>Database Query</option>
                                    <option>API Transmission</option>
                                </select>
                            </div>
                            <textarea className="form-textarea mono mb-4" value={form.payload} onChange={e => setForm({ ...form, payload: e.target.value })}
                                placeholder="E.g., Remind John Doe (johndoe@email.com) about his appointment..." rows={3} required />
                            <div className="flex justify-end">
                                <button type="submit" className="btn btn-primary" disabled={aiLoading}>
                                    {aiLoading ? 'Intercepting...' : 'Fire Payload'}
                                </button>
                            </div>
                        </form>

                        {aiResult && (
                            <div className="mt-6 p-4 rounded-md" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--accent-red-dim)' }}>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="status-dot red" style={{ color: 'var(--accent-red)' }}>Threat Neutralized</span>
                                        <span className="badge badge-red mx-2 shadow-lg">{aiResult.risk_level} Risk</span>
                                    </div>
                                    <span className="badge badge-cyan">{aiResult.pii_detected.length} Element(s) Scrubbed</span>
                                </div>
                                <div className="p-4 rounded-md mb-2" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
                                    <span className="text-muted block mb-2" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Sanitized Output</span>
                                    <div className="mono text-primary" style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                                        {aiResult.sanitized_payload}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="dash-grid-2 mb-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {/* Visual Monitor */}
                <div className="card card-highlight-green" style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}>
                    <div className="card-header border-b">
                        <h3>Proxy Core Status</h3>
                        <span className="status-dot green">Online</span>
                    </div>
                    <div className="card-body flex-col items-center justify-center p-8">
                        <div className="shield-monitor mb-6">
                            <div className="shield-pulse"></div>
                            <div className="shield-pulse"></div>
                            <div className="shield-pulse"></div>
                            <div className="shield-core">🛡️</div>
                        </div>
                        <h2 className="text-center font-bold text-xl mb-1 text-green" style={{ color: 'var(--accent-green)' }}>Maximum Defense</h2>
                        <p className="text-center text-secondary" style={{ fontSize: '0.8rem' }}>100% of outbound traffic is actively filtered and redacted.</p>
                    </div>
                </div>

                {/* Configurations */}
                <div className="card">
                    <div className="card-header border-b">
                        <h3>Active Protocols</h3>
                        <span className="badge badge-cyan">4 Active</span>
                    </div>
                    <div className="card-body p-0">
                        <div className="guardrail-list p-4">
                            {[
                                { k: 'pii_redaction', title: 'Dynamic PII Redaction', desc: 'Automatically masks identified PII entities before data leaves the secure perimeter.' },
                                { k: 'contextual_filtering', title: 'Contextual Prompt Shield', desc: 'Blocks LLM prompts that violate semantic organizational privacy directives.' },
                                { k: 'anonymization', title: 'K-Anonymity Processor', desc: 'Transforms outbound analytical datasets to prevent re-identification attacks.' },
                                { k: 'encryption_in_transit', title: 'Quantum-Safe Tunnel', desc: 'Enforces strict end-to-end encryption for all vault synchronization traffic.' }
                            ].map(g => (
                                <div key={g.k} className="guardrail-item hover:bg-tertiary transition-colors">
                                    <div className={`guardrail-dot ${config[g.k] ? 'on' : ''}`} />
                                    <div className="guardrail-info">
                                        <h4>{g.title}</h4>
                                        <p>{g.desc}</p>
                                    </div>
                                    <div className={`toggle ${config[g.k] ? 'on' : ''}`} onClick={() => toggle(g.k)}>
                                        <div className="toggle-knob" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="dash-grid-2">
                {/* Vaults Grid */}
                <div className="flex-col">
                    <h3 className="mb-4 text-secondary" style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Encrypted Privacy Vaults</h3>
                    <div className="vault-grid">
                        {vaults.map(v => (
                            <div key={v.id} className="vault-card hover:border-violet transition-colors">
                                <span className="vault-bg-pattern">🗄️</span>
                                <div className="vault-header">
                                    <div className="flex gap-3">
                                        <div className="vault-icon-large">🔐</div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{v.name}</h4>
                                            <span className="badge badge-violet mt-1" style={{ fontSize: '0.65rem' }}>{v.encryption_standard}</span>
                                        </div>
                                    </div>
                                    <span className="status-dot green" style={{ fontSize: '0.6rem' }}>Sync</span>
                                </div>
                                <div className="flex-col gap-1 z-10">
                                    <div className="flex justify-between text-muted" style={{ fontSize: '0.75rem' }}>
                                        <span>Capacity Utilization</span>
                                        <span className="text-primary font-bold">{v.record_count} keys</span>
                                    </div>
                                    <div className="progress-bar mt-1">
                                        <div className="progress-bar-fill" style={{ width: `${Math.min(100, (v.record_count / 10000) * 100)}%`, background: 'var(--accent-violet)' }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Intercept Log */}
                <div className="card sticky" style={{ top: 'var(--space-6)' }}>
                    <div className="card-header border-b">
                        <h3>Live Proxy Feed</h3>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>Last 50 events</span>
                    </div>
                    <div className="card-body p-0">
                        <div className="proxy-list p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {proxyLog.map(log => (
                                <div key={log.id} className="proxy-item hover:border-cyan transition-colors" style={{ padding: 'var(--space-4)' }}>
                                    <div className="proxy-dot shadow-lg" />
                                    <div className="proxy-info">
                                        <div className="proxy-header mb-1">
                                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{log.event}</span>
                                        </div>
                                        <div className="proxy-types mb-2">
                                            {log.details.types?.map((t, i) => (
                                                <span key={i} className="px-2 py-1 rounded" style={{ fontSize: '0.65rem', background: 'var(--bg-primary)', color: 'var(--accent-cyan)', border: '1px solid var(--border-subtle)' }}>{t}</span>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center text-muted" style={{ fontSize: '0.65rem' }}>
                                            <span>Origin: <span className="font-mono text-cyan">{log.details.source}</span></span>
                                            <span>{log.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {proxyLog.length === 0 && <div className="p-4 text-center text-muted text-sm border-dashed border border-subtle rounded-md">Proxy feed idle</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
