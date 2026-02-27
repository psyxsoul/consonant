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

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Initializing Discovery Engine...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>Semantic Discovery</h1>
                    <p>Continuous AI-powered unstructured data classification</p>
                </div>
                <span className="status-dot green">Coverage Active</span>
            </div>

            <div className="dash-grid-2 mb-6">
                {/* Scanner Interface */}
                <div className="card">
                    <div className="card-header border-b">
                        <h3>🧠 AI Scanner Engine</h3>
                        <button className="btn-text" onClick={() => setScanInput(sampleSchema)}>Load Sample</button>
                    </div>
                    <div className="card-body">
                        <div className="scanner-container mb-4">
                            <div className="scanner-bg" />
                            {scanning && <div className="scanner-line" />}
                            <div style={{ position: 'relative', zIndex: 10 }}>
                                {scanning ? (
                                    <div className="flex-col items-center justify-center p-8 text-center" style={{ gap: 'var(--space-3)' }}>
                                        <div className="spinner" style={{ borderColor: 'var(--accent-cyan-dim)', borderTopColor: 'var(--accent-cyan)' }} />
                                        <span className="text-cyan" style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.8rem' }}>AI Analyzing Schema Patterns...</span>
                                    </div>
                                ) : (
                                    <textarea
                                        className="form-textarea mono"
                                        value={scanInput}
                                        onChange={(e) => setScanInput(e.target.value)}
                                        placeholder="Paste SQL schema, JSON payload, or CSV snippet to parse for hidden PII..."
                                        rows={6}
                                        style={{ background: 'transparent', border: '1px dashed var(--border-default)', minHeight: '180px' }}
                                        disabled={scanning}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>Powered by Gemini 2.5 Flash</span>
                            <button className="btn btn-primary" onClick={handleScan} disabled={scanning || !scanInput.trim()}>
                                {scanning ? 'Scanning...' : '🚀 Execute Scan'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Risk Distribution Radar (Using stats map) */}
                <div className="card card-accent">
                    <div className="card-header border-b">
                        <h3>Asset Posture</h3>
                    </div>
                    <div className="card-body">
                        <div className="kpi-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                            <div className="kpi-card p-4" style={{ background: 'var(--bg-tertiary)' }}>
                                <div className="kpi-label mb-2">Critical PII</div>
                                <div className="kpi-value text-red" style={{ color: 'var(--accent-red)' }}>{stats.critical || 0}</div>
                            </div>
                            <div className="kpi-card p-4" style={{ background: 'var(--bg-tertiary)' }}>
                                <div className="kpi-label mb-2">High Risk</div>
                                <div className="kpi-value text-amber" style={{ color: 'var(--accent-amber)' }}>{stats.high || 0}</div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Total Monitored Assets</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{stats.total || 0}</span>
                            </div>
                            <div className="risk-bar">
                                {stats.critical > 0 && <div style={{ flex: stats.critical, background: 'var(--accent-red)' }} title={`Critical: ${stats.critical}`} />}
                                {stats.high > 0 && <div style={{ flex: stats.high, background: 'var(--accent-amber)' }} title={`High: ${stats.high}`} />}
                                {stats.medium > 0 && <div style={{ flex: stats.medium, background: 'var(--accent-cyan)' }} title={`Medium: ${stats.medium}`} />}
                                {stats.low > 0 && <div style={{ flex: stats.low, background: 'var(--accent-green)' }} title={`Low: ${stats.low}`} />}
                            </div>
                            <div className="flex justify-between mt-2 text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                <span>Risk Spread</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {scanResult && (
                <div className="card card-highlight-green mb-6 animate-fade-in">
                    <div className="card-header pb-4 border-b">
                        <h3>✅ AI Scan Complete</h3>
                        <div className="flex items-center gap-3">
                            <span className="badge badge-cyan">{scanResult.findings_count || 0} discovered</span>
                            <button className="btn-text" onClick={() => setScanResult(null)}>Dismiss</button>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        {scanResult.results?.length > 0 ? (
                            <table className="data-table">
                                <thead><tr><th>Discovered Element</th><th>Classifier</th><th>Confidence</th><th>Severity</th></tr></thead>
                                <tbody>
                                    {scanResult.results.map((r, i) => (
                                        <tr key={i}>
                                            <td><code className="text-cyan px-2 py-1" style={{ background: 'var(--bg-primary)', borderRadius: '4px' }}>{r.field_name}</code></td>
                                            <td style={{ fontWeight: 600 }}>{r.pii_type}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="progress-bar" style={{ width: '60px', height: '4px' }}>
                                                        <div className="progress-bar-fill" style={{ width: `${r.confidence}%`, background: r.confidence > 90 ? 'var(--accent-green)' : 'var(--accent-amber)' }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem' }}>{r.confidence}%</span>
                                                </div>
                                            </td>
                                            <td><span className={`badge ${severityBadge(r.severity)}`}>{r.severity}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-6 text-center text-muted">No high-risk structures detected in this payload.</div>
                        )}
                        {scanResult.ai_analysis && (
                            <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-tertiary)' }}>
                                <div className="text-secondary" style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
                                    <strong className="text-cyan">AI Assessment:</strong> {scanResult.ai_analysis}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Structured Asset Inventory */}
            <div className="card">
                <div className="card-header border-b">
                    <h3>Discovered Asset Inventory</h3>
                    <div className="flex gap-2">
                        <button className="btn-text">Export CSV</button>
                    </div>
                </div>
                {results.length > 0 ? (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead><tr><th>Data Element</th><th>Classification</th><th>Origin Source</th><th>Confidence Score</th><th>Severity</th><th>Context / Path</th></tr></thead>
                            <tbody>
                                {results.map((r) => (
                                    <tr key={r.id}>
                                        <td><code className="text-cyan font-bold">{r.field_name}</code></td>
                                        <td style={{ fontWeight: 600 }}>{r.pii_type}</td>
                                        <td>
                                            <span className="flex items-center gap-2">
                                                <span className="text-muted">🗄️</span> {r.source}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="progress-bar" style={{ width: '40px', height: '4px' }}>
                                                    <div className="progress-bar-fill" style={{ width: `${r.confidence}%`, background: r.confidence > 90 ? 'var(--accent-green)' : 'var(--accent-amber)' }} />
                                                </div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{r.confidence}%</span>
                                            </div>
                                        </td>
                                        <td><span className={`badge ${severityBadge(r.severity)}`}>{r.severity}</span></td>
                                        <td className="cell-truncate text-secondary" title={r.context}>{r.context}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="scanner-container mb-4" style={{ minHeight: '100px', width: '200px', padding: 0 }}>
                            <div className="scanner-bg" />
                            <div className="scanner-line" />
                        </div>
                        <p>No verified assets stored. Execute a scan above to discover data.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
