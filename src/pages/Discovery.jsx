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
    const [showScan, setShowScan] = useState(false)

    const load = () => {
        Promise.all([api.getDiscoveryResults(), api.getDiscoveryStats()])
            .then(([r, s]) => { setResults(r); setStats(s) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const handleScan = async (e) => {
        e.preventDefault()
        setScanning(true)
        try {
            await api.runScan({ schema: scanInput })
            setScanInput('')
            setShowScan(false)
            load()
        } catch (err) { alert(err.message) }
        finally { setScanning(false) }
    }

    if (loading) return <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Semantic Discovery</h1>
                    <p className="page-header-subtitle">AI-powered PII detection with context-aware intent analysis</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowScan(!showScan)}>🔍 Run New Scan</button>
            </div>

            {showScan && (
                <div className="dash-panel" style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>AI-Powered Schema Scan</h3>
                    <form onSubmit={handleScan}>
                        <textarea value={scanInput} onChange={(e) => setScanInput(e.target.value)}
                            placeholder="Paste your database schema, table structure, or data description here...&#10;&#10;Example: CREATE TABLE users (id INT, name VARCHAR, aadhaar_number VARCHAR, email VARCHAR, phone VARCHAR);"
                            rows={5} required
                            style={{ width: '100%', padding: 'var(--space-4)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }} />
                        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                            <button type="submit" className="btn btn-primary" disabled={scanning}>{scanning ? '🔄 Scanning with Gemini AI...' : '🚀 Analyze with AI'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowScan(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

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

            <div className="dash-panel">
                <div className="dash-panel-header">
                    <h3>Overall Risk Distribution</h3>
                    <span className="badge badge-amber">Needs Attention</span>
                </div>
                <div className="risk-meter" style={{ height: 12, borderRadius: 6 }}>
                    <div className="risk-meter-bar" style={{ flex: stats.critical || 1, background: 'var(--accent-red)', borderRadius: '6px 0 0 6px' }} />
                    <div className="risk-meter-bar" style={{ flex: stats.high || 1, background: 'var(--accent-amber)' }} />
                    <div className="risk-meter-bar" style={{ flex: stats.medium || 1, background: 'var(--accent-cyan)' }} />
                    <div className="risk-meter-bar" style={{ flex: stats.low || 1, background: 'var(--accent-green)', borderRadius: '0 6px 6px 0' }} />
                </div>
            </div>

            <div className="dash-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="dash-panel-header" style={{ padding: 'var(--space-5) var(--space-6)' }}>
                    <h3>Scan Results</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stats.total || 0} findings</span>
                </div>
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
            </div>
        </div>
    )
}
