import { useState, useEffect } from 'react'
import api from '../services/api'

export default function LLMFirewall() {
    const [prompt, setPrompt] = useState('')
    const [model, setModel] = useState('GPT-4o')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState([])
    const [proxyLog, setProxyLog] = useState([])

    useEffect(() => {
        api.getProxyLog().then(setProxyLog).catch(() => { })
    }, [])

    const scanPrompt = async () => {
        if (!prompt.trim() || loading) return
        setLoading(true); setResult(null)
        try {
            const data = await api.firewall(prompt, model)
            setResult(data)
            setHistory(prev => [{ ...data, timestamp: new Date(), model }, ...prev].slice(0, 20))
            // Refresh proxy log
            api.getProxyLog().then(setProxyLog).catch(() => { })
        } catch (err) {
            setResult({ error: err.message })
        } finally { setLoading(false) }
    }

    const SAMPLE_PROMPTS = [
        { label: '📧 Email with PII', text: 'Summarize this email: "Hi, this is Priya Sharma (priya.sharma@acme.in). My Aadhaar number is 2345 6789 0123 and my PAN is ABCDE1234F. Please process my salary of ₹15,00,000 to HDFC account 12345678901234."' },
        { label: '💳 Financial Data', text: 'Create a report for customer Rajesh Kumar, DOB 15/03/1990, residing at 42 MG Road Bangalore 560001. His credit card 4111-1111-1111-1111 was charged ₹50,000.' },
        { label: '🏥 Health Records', text: 'Patient Anita Desai (ID: P-45892) was diagnosed with Type 2 Diabetes on 10/02/2026. Contact: +91 98765 43210. Insurance: Star Health Policy #SH2026789.' },
    ]

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>🛡️ LLM Firewall</h1>
                    <p>Intercept, detect, and redact PII before it reaches external AI models</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Target Model:</span>
                    <select value={model} onChange={e => setModel(e.target.value)} className="form-input"
                        style={{ width: '140px', padding: '6px 12px', fontSize: '0.8rem' }}>
                        <option>GPT-4o</option>
                        <option>Claude 3.5</option>
                        <option>Gemini 2.5</option>
                        <option>Llama 3</option>
                    </select>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="dash-grid-4 mb-8">
                {[
                    { label: 'Prompts Intercepted', value: proxyLog.length + history.length, icon: '🔍', color: 'var(--accent-cyan)' },
                    { label: 'Fields Redacted', value: proxyLog.reduce((a, l) => a + l.fields_redacted, 0) + history.reduce((a, h) => a + (h.pii_detected || 0), 0), icon: '🚫', color: 'var(--accent-red)' },
                    { label: 'Models Protected', value: new Set([...proxyLog.map(l => l.model), ...history.map(h => h.model)]).size || 1, icon: '🤖', color: 'var(--accent-violet)' },
                    { label: 'Safe Prompts', value: history.filter(h => h.safe_to_send).length + proxyLog.filter(l => l.fields_redacted === 0).length, icon: '✅', color: 'var(--accent-green)' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card">
                        <div className="kpi-label">{s.label}</div>
                        <div className="kpi-value">{s.value}</div>
                        <div className="kpi-icon" style={{ color: s.color }}>{s.icon}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                {/* Left — Input */}
                <div className="card">
                    <div className="card-header border-b"><h3>Employee Prompt (Intercepted)</h3></div>
                    <div className="card-body">
                        {/* Quick samples */}
                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
                            {SAMPLE_PROMPTS.map((s, i) => (
                                <button key={i} className="btn btn-secondary" onClick={() => setPrompt(s.text)}
                                    style={{ padding: '4px 10px', fontSize: '0.7rem' }}>{s.label}</button>
                            ))}
                        </div>
                        <textarea className="form-input" value={prompt} onChange={e => setPrompt(e.target.value)}
                            placeholder="Paste an employee's LLM prompt here to scan for PII leakage..."
                            rows={10} style={{ resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }} />
                        <button className="btn btn-primary mt-4" onClick={scanPrompt} disabled={loading || !prompt.trim()}
                            style={{ width: '100%' }}>
                            {loading ? '⏳ Scanning for PII...' : '🛡️ Scan & Redact PII'}
                        </button>
                    </div>
                </div>

                {/* Right — Result */}
                <div className="card">
                    <div className="card-header border-b">
                        <h3>Firewall Analysis</h3>
                        {result && !result.error && (
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                                background: result.safe_to_send ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
                                color: result.safe_to_send ? 'var(--accent-green)' : 'var(--accent-red)',
                                textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                                {result.safe_to_send ? '✅ SAFE' : `🚨 ${result.risk_level} RISK`}
                            </span>
                        )}
                    </div>
                    <div className="card-body">
                        {!result && !loading && (
                            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>🛡️</div>
                                <p style={{ fontSize: '0.85rem' }}>Enter a prompt to analyze for PII leakage</p>
                            </div>
                        )}

                        {loading && (
                            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                                <div className="spinner" style={{ margin: '0 auto var(--space-4)' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analyzing prompt for sensitive data...</p>
                            </div>
                        )}

                        {result && !result.error && (
                            <>
                                {/* Redactions */}
                                {result.redactions?.length > 0 && (
                                    <div className="mb-4">
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', marginBottom: 'var(--space-3)', textTransform: 'uppercase' }}>
                                            🚫 {result.pii_detected} PII Items Detected & Redacted
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                            {result.redactions.map((r, i) => (
                                                <div key={i} style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: 'var(--space-2) var(--space-3)', background: 'var(--accent-red-dim)',
                                                    borderRadius: 'var(--radius-sm)', fontSize: '0.75rem'
                                                }}>
                                                    <span style={{ fontFamily: 'var(--font-mono)', textDecoration: 'line-through', color: 'var(--accent-red)' }}>{r.original}</span>
                                                    <span style={{ fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>{r.replaced_with}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Redacted prompt */}
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--accent-green)', textTransform: 'uppercase' }}>
                                    ✅ Safe Prompt (Ready to Send)
                                </div>
                                <div style={{
                                    padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                                    fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre-wrap',
                                    border: '1px solid var(--accent-green)', borderColor: result.safe_to_send ? 'var(--accent-green)' : 'var(--accent-amber)'
                                }}>
                                    {result.redacted_prompt}
                                </div>

                                {result.summary && (
                                    <div style={{ marginTop: 'var(--space-4)', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                        {result.summary}
                                    </div>
                                )}
                            </>
                        )}

                        {result?.error && (
                            <div style={{ color: 'var(--accent-red)', padding: 'var(--space-4)' }}>❌ {result.error}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Intercept History */}
            {proxyLog.length > 0 && (
                <div className="card mt-8">
                    <div className="card-header border-b"><h3>Recent Intercept Log</h3></div>
                    <div className="card-body p-0">
                        <table className="data-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>User</th>
                                    <th>Model</th>
                                    <th>Fields Redacted</th>
                                    <th>Types</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proxyLog.map((log, i) => (
                                    <tr key={i}>
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{log.time}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{log.user_name}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{log.model}</td>
                                        <td>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700,
                                                background: log.fields_redacted > 0 ? 'var(--accent-red-dim)' : 'var(--accent-green-dim)',
                                                color: log.fields_redacted > 0 ? 'var(--accent-red)' : 'var(--accent-green)'
                                            }}>
                                                {log.fields_redacted}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                            {JSON.parse(log.redacted_types || '[]').join(', ') || '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
