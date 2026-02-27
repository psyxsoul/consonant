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
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleScan = async (e) => {
        e.preventDefault()
        if (!scanInput.trim()) return
        setScanning(true); setScanResult(null); setError(null)
        try {
            const result = await api.runScan({ schema: scanInput })
            setScanResult(result); setScanInput(''); load()
        } catch (err) { setError(err.message) }
        finally { setScanning(false) }
    }

    const sampleSchema = `CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(150),
  phone VARCHAR(15),
  aadhaar_number VARCHAR(12),
  pan_card VARCHAR(10),
  date_of_birth DATE,
  address TEXT,
  ip_address INET
);`

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Loading discovery data...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>Semantic Discovery</h1>
                    <p>AI-powered PII detection with Gemini 2.5 Flash</p>
                </div>
                <span className="status-dot green">AI Engine Active</span>
            </div>

            {/* AI Scan Form */}
            <div className="card card-highlight-cyan mb-6">
                <div className="card-header">
                    <h3>🧠 AI-Powered PII Scan</h3>
                    <button className="btn-text" onClick={() => setScanInput(sampleSchema)}>Load Sample</button>
                </div>
                <div className="card-body">
                    <p className="text-secondary mb-4" style={{ fontSize: '0.85rem' }}>
                        Paste your schema, CSV headers, or any text — Gemini AI analyzes for PII and compliance risks.
                    </p>
                    <form onSubmit={handleScan}>
                        <textarea className="form-textarea mono" value={scanInput} onChange={(e) => setScanInput(e.target.value)}
                            placeholder="Paste any data structure here..." rows={5} required />
                        <div className="flex items-center gap-4 mt-4">
                            <button type="submit" className="btn btn-primary" disabled={scanning || !scanInput.trim()}>
                                {scanning ? '🔄 Analyzing...' : '🚀 Run AI Scan'}
                            </button>
                            {scanning && <span className="text-muted" style={{ fontSize: '0.8rem' }}>This may take a few seconds...</span>}
                        </div>
                    </form>
                </div>
            </div>

            {/* Scan Result */}
            {scanResult && (
                <div className="card card-highlight-green mb-6 animate-fade-in">
                    <div className="card-header">
                        <h3>✅ Scan Complete — {scanResult.findings_count || 0} findings</h3>
                        <button className="btn-text" onClick={() => setScanResult(null)}>Dismiss</button>
                    </div>
                    <div className="card-body p-0">
                        {scanResult.results?.map((r, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border-b">
                                <span className={`badge ${severityBadge(r.severity)}`}>{r.severity}</span>
                                <code className="text-cyan">{r.field_name}</code>
                                <span style={{ fontWeight: 500 }}>{r.pii_type}</span>
                                <span className="text-muted ml-auto" style={{ fontSize: '0.8rem' }}>{r.confidence}%</span>
                            </div>
                        ))}
                        {scanResult.ai_analysis && (
                            <div className="ai-output">{scanResult.ai_analysis}</div>
                        )}
                    </div>
                </div>
            )}

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {/* Risk Stats */}
            <div className="kpi-grid mb-6">
                {[
                    { label: 'Critical', value: stats.critical || 0, color: 'var(--accent-red)', icon: '🔴' },
                    { label: 'High Risk', value: stats.high || 0, color: 'var(--accent-amber)', icon: '🟠' },
                    { label: 'Medium', value: stats.medium || 0, color: 'var(--accent-cyan)', icon: '🔵' },
                    { label: 'Low Risk', value: stats.low || 0, color: 'var(--accent-green)', icon: '🟢' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card">
                        <div className="kpi-top"><span className="kpi-label">{s.label}</span></div>
                        <div className="kpi-value" style={{ color: s.color }}>{s.value}</div>
                        <div className="kpi-icon">{s.icon}</div>
                    </div>
                ))}
            </div>

            {/* Risk Distribution */}
            {(stats.total || 0) > 0 && (
                <div className="card mb-6">
                    <div className="card-header">
                        <h3>Risk Distribution</h3>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{stats.total} total</span>
                    </div>
                    <div className="card-body">
                        <div className="risk-bar">
                            {stats.critical > 0 && <div style={{ flex: stats.critical, background: 'var(--accent-red)' }} />}
                            {stats.high > 0 && <div style={{ flex: stats.high, background: 'var(--accent-amber)' }} />}
                            {stats.medium > 0 && <div style={{ flex: stats.medium, background: 'var(--accent-cyan)' }} />}
                            {stats.low > 0 && <div style={{ flex: stats.low, background: 'var(--accent-green)' }} />}
                        </div>
                    </div>
                </div>
            )}

            {/* Results Table */}
            <div className="card">
                <div className="card-header">
                    <h3>All Scan Results</h3>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>{results.length} findings</span>
                </div>
                {results.length > 0 ? (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead><tr><th>Field</th><th>PII Type</th><th>Source</th><th>Confidence</th><th>Severity</th><th>Context</th></tr></thead>
                            <tbody>
                                {results.map((r) => (
                                    <tr key={r.id}>
                                        <td><code className="text-cyan">{r.field_name}</code></td>
                                        <td style={{ fontWeight: 500 }}>{r.pii_type}</td>
                                        <td>{r.source}</td>
                                        <td style={{ fontWeight: 600 }}>{r.confidence}%</td>
                                        <td><span className={`badge ${severityBadge(r.severity)}`}>{r.severity}</span></td>
                                        <td className="cell-truncate" title={r.context}>{r.context}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state"><span className="empty-icon">🔍</span><p>No scan results yet. Use the AI scan form above.</p></div>
                )}
            </div>
        </div>
    )
}
