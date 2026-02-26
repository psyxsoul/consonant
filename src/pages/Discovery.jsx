import { useState, useEffect } from 'react'
import api from '../services/api'

const severityBadge = (sev) => {
    const map = { Critical: 'badge-red', High: 'badge-amber', Medium: 'badge-cyan', Low: 'badge-green' }
    return map[sev] || 'badge-cyan'
}

export default function Discovery() {
    const [results, setResults] = useState([])
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [scanning, setScanning] = useState(false)
    const [scanInput, setScanInput] = useState('')
    const [scanResult, setScanResult] = useState(null)
    const [error, setError] = useState(null)

    const load = () => {
        Promise.all([api.getDiscoveryResults(), api.getDiscoveryStats()])
            .then(([r, s]) => { setResults(r); setStats(s) })
            .catch(err => { console.error(err); setError(err.message) })
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleScan = async (e) => {
        e.preventDefault()
        if (!scanInput.trim()) return
        setScanning(true)
        setScanResult(null)
        setError(null)
        try {
            const result = await api.runScan({ schema: scanInput })
            setScanResult(result)
            setScanInput('')
            load() // reload results
        } catch (err) {
            setError(err.message)
        } finally {
            setScanning(false)
        }
    }

    // Pre-fill sample schema for demo
    const sampleSchema = `CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(150),
  phone VARCHAR(15),
  aadhaar_number VARCHAR(12),
  pan_card VARCHAR(10),
  date_of_birth DATE,
  address TEXT,
  ip_address INET,
  device_fingerprint TEXT,
  credit_card_number VARCHAR(19),
  bank_account VARCHAR(20)
);`

    if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading discovery data...</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Semantic Discovery</h1>
                    <p className="page-header-subtitle">AI-powered PII detection with Gemini 2.5 Flash — paste any schema or text below</p>
                </div>
                <span className="badge badge-green" style={{ fontSize: '0.8rem' }}>● AI Engine Active</span>
            </div>

            {/* ===== AI SCAN FORM — PROMINENT ===== */}
            <div className="dash-panel" style={{ borderLeft: '4px solid var(--accent-cyan)', marginBottom: 'var(--space-6)' }}>
                <div className="dash-panel-header">
                    <h3>🧠 AI-Powered PII Scan</h3>
                    <button className="btn btn-ghost" onClick={() => setScanInput(sampleSchema)} style={{ fontSize: '0.75rem' }}>Load Sample Schema</button>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                    Paste your database schema, CSV headers, API payload, or any text — Gemini AI will analyze it for PII, linkability risks, and DPDPA compliance issues.
                </p>
                <form onSubmit={handleScan}>
                    <textarea
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        placeholder={`Paste any data structure here...\n\nExamples:\n• SQL schema: CREATE TABLE users (name VARCHAR, aadhaar VARCHAR...)\n• CSV headers: name, email, phone, pan_number, dob\n• JSON: {"customer": {"name": "...", "aadhaar": "..."}}\n• Plain text: We store customer Aadhaar numbers alongside their email addresses`}
                        rows={6}
                        required
                        style={{
                            width: '100%', padding: 'var(--space-4)',
                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)',
                            borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                            fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical'
                        }}
                    />
                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', alignItems: 'center' }}>
                        <button type="submit" className="btn btn-primary" disabled={scanning || !scanInput.trim()}>
                            {scanning ? '🔄 Analyzing with Gemini AI...' : '🚀 Run AI Scan'}
                        </button>
                        {scanning && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This may take a few seconds...</span>}
                    </div>
                </form>
            </div>

            {/* ===== SCAN RESULT ===== */}
            {scanResult && (
                <div className="dash-panel" style={{ borderLeft: '4px solid var(--accent-green)', marginBottom: 'var(--space-6)' }}>
                    <div className="dash-panel-header">
                        <h3>✅ Scan Complete — {scanResult.findings_count || 0} findings</h3>
                        <button className="btn btn-ghost" onClick={() => setScanResult(null)}>Dismiss</button>
                    </div>
                    {scanResult.results && scanResult.results.length > 0 && (
                        <div style={{ marginTop: 'var(--space-4)' }}>
                            {scanResult.results.map((r, i) => (
                                <div key={i} style={{
                                    display: 'flex', gap: 'var(--space-4)', alignItems: 'center',
                                    padding: 'var(--space-3)', borderBottom: '1px solid var(--border-default)'
                                }}>
                                    <span className={`badge ${severityBadge(r.severity)}`}>{r.severity}</span>
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{r.field_name}</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.pii_type}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{r.confidence}% confident</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {scanResult.ai_analysis && (
                        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {scanResult.ai_analysis}
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)', background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-red)', fontSize: '0.85rem' }}>
                    Error: {error}
                </div>
            )}

            {/* ===== STATS ===== */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card">
                    <div className="stat-card-header"><div className="stat-card-icon" style={{ background: 'var(--accent-red-dim)' }}>🔴</div></div>
                    <div className="stat-card-value" style={{ color: 'var(--accent-red)' }}>{stats.critical || 0}</div>
                    <div className="stat-card-label">Critical Findings</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header"><div className="stat-card-icon" style={{ background: 'var(--accent-amber-dim)' }}>🟠</div></div>
                    <div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{stats.high || 0}</div>
                    <div className="stat-card-label">High Risk</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header"><div className="stat-card-icon" style={{ background: 'var(--accent-cyan-dim)' }}>🔵</div></div>
                    <div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>{stats.medium || 0}</div>
                    <div className="stat-card-label">Medium Risk</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header"><div className="stat-card-icon" style={{ background: 'var(--accent-green-dim)' }}>🟢</div></div>
                    <div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{stats.low || 0}</div>
                    <div className="stat-card-label">Low Risk</div>
                </div>
            </div>

            {/* ===== RISK METER ===== */}
            {(stats.total || 0) > 0 && (
                <div className="dash-panel" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="dash-panel-header">
                        <h3>Risk Distribution</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stats.total} total findings</span>
                    </div>
                    <div className="risk-meter" style={{ height: 12, borderRadius: 6, display: 'flex', overflow: 'hidden' }}>
                        {stats.critical > 0 && <div style={{ flex: stats.critical, background: 'var(--accent-red)' }} />}
                        {stats.high > 0 && <div style={{ flex: stats.high, background: 'var(--accent-amber)' }} />}
                        {stats.medium > 0 && <div style={{ flex: stats.medium, background: 'var(--accent-cyan)' }} />}
                        {stats.low > 0 && <div style={{ flex: stats.low, background: 'var(--accent-green)' }} />}
                    </div>
                </div>
            )}

            {/* ===== RESULTS TABLE ===== */}
            <div className="dash-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="dash-panel-header" style={{ padding: 'var(--space-5) var(--space-6)' }}>
                    <h3>All Scan Results</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{results.length} findings</span>
                </div>
                {results.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr><th>Field / Location</th><th>PII Type</th><th>Source</th><th>Confidence</th><th>Severity</th><th>Context</th></tr>
                        </thead>
                        <tbody>
                            {results.map((r) => (
                                <tr key={r.id}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{r.field_name}</td>
                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.pii_type}</td>
                                    <td style={{ fontSize: '0.8rem' }}>{r.source}</td>
                                    <td style={{ fontWeight: 600 }}>{r.confidence}%</td>
                                    <td><span className={`badge ${severityBadge(r.severity)}`}>{r.severity}</span></td>
                                    <td style={{ fontSize: '0.8rem', maxWidth: 260 }}>{r.context}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>🔍</p>
                        <p>No scan results yet. Use the AI scan form above to analyze your data.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
