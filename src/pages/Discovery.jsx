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

    if (loading) return (
        <div className="flex-col items-center justify-center animate-fade-in" style={{ height: '60vh', color: 'var(--text-muted)' }}>
            <div className="text-center">
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-cyan-dim)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', animation: 'rotate 1s linear infinite', margin: '0 auto 16px' }} />
                <span>Loading discovery data...</span>
            </div>
        </div>
    )

    return (
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="page-header flex justify-between items-end mb-8">
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Semantic Discovery</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>AI-powered PII detection with Gemini 2.5 Flash — paste any schema or text below</p>
                </div>
                <span className="badge badge-green">● AI Engine Active</span>
            </div>

            {/* ===== AI SCAN FORM — PROMINENT ===== */}
            <div className="glass-card mb-8" style={{ borderLeft: '4px solid var(--accent-cyan)', padding: 'var(--space-6)' }}>
                <div className="flex justify-between items-center mb-4">
                    <h3 style={{ fontSize: '1.2rem' }}>🧠 AI-Powered PII Scan</h3>
                    <button className="btn btn-ghost" onClick={() => setScanInput(sampleSchema)} style={{ fontSize: '0.8rem' }}>Load Sample Schema</button>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>
                    Paste your database schema, CSV headers, API payload, or any text — Gemini AI will analyze it for PII, linkability risks, and DPDPA compliance issues.
                </p>
                <form onSubmit={handleScan}>
                    <textarea
                        className="form-textarea"
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        placeholder={`Paste any data structure here...\n\nExamples:\n• SQL schema: CREATE TABLE users (name VARCHAR, aadhaar VARCHAR...)\n• CSV headers: name, email, phone, pan_number, dob\n• JSON: {"customer": {"name": "...", "aadhaar": "..."}}\n• Plain text: We store customer Aadhaar numbers alongside their email addresses`}
                        rows={6}
                        required
                        style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                    />
                    <div className="flex items-center gap-4 mt-6">
                        <button type="submit" className="btn btn-primary" disabled={scanning || !scanInput.trim()}>
                            {scanning ? '🔄 Analyzing with Gemini AI...' : '🚀 Run AI Scan'}
                        </button>
                        {scanning && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>This may take a few seconds...</span>}
                    </div>
                </form>
            </div>

            {/* ===== SCAN RESULT ===== */}
            {scanResult && (
                <div className="glass-card mb-8 animate-fade-in" style={{ borderLeft: '4px solid var(--accent-green)', padding: 'var(--space-6)' }}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 style={{ fontSize: '1.2rem' }}>✅ Scan Complete — {scanResult.findings_count || 0} findings</h3>
                        <button className="btn btn-ghost" onClick={() => setScanResult(null)}>Dismiss</button>
                    </div>
                    {scanResult.results && scanResult.results.length > 0 && (
                        <div className="flex-col">
                            {scanResult.results.map((r, i) => (
                                <div key={i} className="flex items-center gap-4 p-4" style={{
                                    borderBottom: i < scanResult.results.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                                }}>
                                    <span className={`badge ${severityBadge(r.severity)}`}>{r.severity}</span>
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{r.field_name}</span>
                                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.pii_type}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{r.confidence}% confident</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {scanResult.ai_analysis && (
                        <div className="mt-6 p-4" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, border: '1px solid var(--border-default)' }}>
                            {scanResult.ai_analysis}
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="p-4 mb-6" style={{ background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--accent-red)', fontSize: '0.9rem' }}>
                    Error: {error}
                </div>
            )}

            {/* ===== STATS ===== */}
            <div className="grid-4 mb-8">
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔴</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-red)', lineHeight: 1 }}>{stats.critical || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Critical Findings</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🟠</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-amber)', lineHeight: 1 }}>{stats.high || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>High Risk</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔵</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)', lineHeight: 1 }}>{stats.medium || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Medium Risk</div>
                </div>
                <div className="glass-card text-center" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🟢</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-green)', lineHeight: 1 }}>{stats.low || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>Low Risk</div>
                </div>
            </div>

            {/* ===== RISK METER ===== */}
            {(stats.total || 0) > 0 && (
                <div className="glass-card mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 style={{ fontSize: '1.1rem' }}>Risk Distribution</h3>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stats.total} total findings</span>
                    </div>
                    <div style={{ height: 16, borderRadius: 8, display: 'flex', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
                        {stats.critical > 0 && <div style={{ flex: stats.critical, background: 'var(--accent-red)', transition: 'all 0.5s ease' }} title={`Critical: ${stats.critical}`} />}
                        {stats.high > 0 && <div style={{ flex: stats.high, background: 'var(--accent-amber)', transition: 'all 0.5s ease' }} title={`High: ${stats.high}`} />}
                        {stats.medium > 0 && <div style={{ flex: stats.medium, background: 'var(--accent-cyan)', transition: 'all 0.5s ease' }} title={`Medium: ${stats.medium}`} />}
                        {stats.low > 0 && <div style={{ flex: stats.low, background: 'var(--accent-green)', transition: 'all 0.5s ease' }} title={`Low: ${stats.low}`} />}
                    </div>
                </div>
            )}

            {/* ===== RESULTS TABLE ===== */}
            <div className="glass-card p-0" style={{ overflow: 'hidden' }}>
                <div className="flex justify-between items-center p-6 border-b border-default" style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>All Scan Results</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{results.length} findings</span>
                </div>
                {results.length > 0 ? (
                    <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>Field / Location</th><th>PII Type</th><th>Source</th><th>Confidence</th><th>Severity</th><th>Context</th></tr>
                            </thead>
                            <tbody>
                                {results.map((r) => (
                                    <tr key={r.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{r.field_name}</td>
                                        <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.pii_type}</td>
                                        <td style={{ fontSize: '0.85rem' }}>{r.source}</td>
                                        <td style={{ fontWeight: 600 }}>{r.confidence}%</td>
                                        <td><span className={`badge ${severityBadge(r.severity)}`}>{r.severity}</span></td>
                                        <td style={{ fontSize: '0.85rem', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.context}>{r.context}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-10 text-center" style={{ color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔍</p>
                        <p style={{ fontSize: '1.1rem' }}>No scan results yet. Use the AI scan form above to analyze your data.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
