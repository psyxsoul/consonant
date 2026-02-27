import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const DB_TYPES = [
    { value: 'postgresql', label: 'PostgreSQL', icon: '🐘', color: 'var(--accent-cyan)', defaultPort: 5432 },
    { value: 'mysql', label: 'MySQL', icon: '🐬', color: 'var(--accent-amber)', defaultPort: 3306 },
    { value: 'mongodb', label: 'MongoDB', icon: '🍃', color: 'var(--accent-green)', defaultPort: 27017 },
]

const STATUS_MAP = {
    connected: { label: 'Connected', color: 'var(--accent-green)', dot: 'green' },
    pending: { label: 'Pending', color: 'var(--text-muted)', dot: '' },
    failed: { label: 'Failed', color: 'var(--accent-red)', dot: 'red' },
    scanning: { label: 'Scanning...', color: 'var(--accent-cyan)', dot: 'cyan' },
}

export default function DataSources() {
    const [sources, setSources] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [scanningId, setScanningId] = useState(null)
    const [scanResult, setScanResult] = useState(null)
    const [error, setError] = useState(null)
    const { canWrite } = useAuth()

    const [form, setForm] = useState({
        name: '', type: 'postgresql', host: '', port: 5432,
        database_name: '', username: '', password: '', ssl: false
    })

    const load = async () => {
        try {
            const data = await api.getDataSources()
            setSources(data)
        } catch (err) { setError(err.message) }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const handleTypeChange = (type) => {
        const dbType = DB_TYPES.find(d => d.value === type)
        setForm({ ...form, type, port: dbType?.defaultPort || 5432 })
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            await api.addDataSource(form)
            setShowForm(false)
            setForm({ name: '', type: 'postgresql', host: '', port: 5432, database_name: '', username: '', password: '', ssl: false })
            load()
        } catch (err) { setError(err.message) }
    }

    const handleScan = async (id) => {
        setScanningId(id); setScanResult(null); setError(null)
        try {
            const result = await api.scanDataSource(id)
            setScanResult(result)
            load()
        } catch (err) { setError(err.message) }
        finally { setScanningId(null) }
    }

    const handleDelete = async (id) => {
        try { await api.deleteDataSource(id); load() }
        catch (err) { setError(err.message) }
    }

    const handleTest = async (id) => {
        try { await api.testDataSource(id); load() }
        catch (err) { setError(err.message) }
    }

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Loading Connected Sources...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>Data Source Connectors</h1>
                    <p>Connect live databases for automated PII discovery</p>
                </div>
                {canWrite && (
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        + Connect Database
                    </button>
                )}
            </div>

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {/* Add Source Form */}
            {showForm && (
                <div className="card card-highlight-cyan mb-8 animate-fade-in">
                    <div className="card-header border-b"><h3>New Connection</h3></div>
                    <div className="card-body">
                        <form onSubmit={handleAdd}>
                            {/* Database Type Picker */}
                            <div className="mb-6" style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                {DB_TYPES.map(t => (
                                    <button key={t.value} type="button"
                                        className={`btn ${form.type === t.value ? 'btn-primary' : 'btn-secondary'}`}
                                        style={{ flex: 1, padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}
                                        onClick={() => handleTypeChange(t.value)}>
                                        <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                                        <span style={{ fontSize: '0.8rem' }}>{t.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">Connection Name</label>
                                    <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Production DB" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Database Name</label>
                                    <input className="form-input" value={form.database_name} onChange={e => setForm({ ...form, database_name: e.target.value })}
                                        placeholder="e.g. app_production" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Host</label>
                                    <input className="form-input" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })}
                                        placeholder="e.g. db.example.com" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Port</label>
                                    <input type="number" className="form-input" value={form.port} onChange={e => setForm({ ...form, port: parseInt(e.target.value) })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Username</label>
                                    <input className="form-input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                                        placeholder="db_user" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                        placeholder="••••••••" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={form.ssl} onChange={e => setForm({ ...form, ssl: e.target.checked })} />
                                    Enable SSL/TLS
                                </label>
                                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Test & Save Connection</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* KPI Cards */}
            <div className="dash-grid-4 mb-8">
                {[
                    { label: 'Connected Sources', value: sources.filter(s => s.status === 'connected').length, icon: '🔗', color: 'var(--accent-green)' },
                    { label: 'Total Tables', value: sources.reduce((a, s) => a + (s.tables_found || 0), 0), icon: '📋', color: 'var(--accent-cyan)' },
                    { label: 'Total Fields', value: sources.reduce((a, s) => a + (s.fields_found || 0), 0), icon: '🔤', color: 'var(--accent-violet)' },
                    { label: 'PII Detected', value: sources.reduce((a, s) => a + (s.pii_found || 0), 0), icon: '🚨', color: 'var(--accent-red)' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card">
                        <div className="kpi-label">{s.label}</div>
                        <div className="kpi-value">{s.value}</div>
                        <div className="kpi-icon" style={{ color: s.color }}>{s.icon}</div>
                    </div>
                ))}
            </div>

            {/* Source Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--space-6)' }}>
                {sources.map(src => {
                    const dbType = DB_TYPES.find(d => d.value === src.type)
                    const status = STATUS_MAP[src.status] || STATUS_MAP.pending
                    const isScanning = scanningId === src.id

                    return (
                        <div key={src.id} className="card" style={{ borderLeft: `3px solid ${dbType?.color || 'var(--border-default)'}` }}>
                            <div className="card-header border-b">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <span style={{ fontSize: '1.4rem' }}>{dbType?.icon}</span>
                                    <div>
                                        <h3 style={{ fontSize: '1rem' }}>{src.name}</h3>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                            {src.host}:{src.port}/{src.database_name}
                                        </span>
                                    </div>
                                </div>
                                <span className={`status-dot ${status.dot}`} style={{ fontSize: '0.7rem', color: status.color }}>
                                    {isScanning ? 'Scanning...' : status.label}
                                </span>
                            </div>

                            <div className="card-body">
                                {/* Stats Row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                    <div style={{ textAlign: 'center', padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{src.tables_found || 0}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Tables</div>
                                    </div>
                                    <div style={{ textAlign: 'center', padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{src.fields_found || 0}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Fields</div>
                                    </div>
                                    <div style={{ textAlign: 'center', padding: 'var(--space-3)', background: src.pii_found > 0 ? 'var(--accent-red-dim)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: src.pii_found > 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{src.pii_found || 0}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PII</div>
                                    </div>
                                </div>

                                {src.last_scan_at && (
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                                        Last scan: {new Date(src.last_scan_at).toLocaleString('en-IN')}
                                    </div>
                                )}

                                {src.error_message && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-red)', background: 'var(--accent-red-dim)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)' }}>
                                        {src.error_message}
                                    </div>
                                )}

                                {/* Actions */}
                                {canWrite && (
                                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                        <button className="btn btn-secondary" onClick={() => handleTest(src.id)}
                                            style={{ padding: '4px 12px', fontSize: '0.75rem' }}>🔌 Test</button>
                                        <button className="btn btn-primary" onClick={() => handleScan(src.id)} disabled={isScanning}
                                            style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                                            {isScanning ? '⏳ Scanning...' : '🔍 Scan for PII'}
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => handleDelete(src.id)}
                                            style={{ padding: '4px 12px', fontSize: '0.75rem', color: 'var(--accent-red)' }}>🗑️</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}

                {sources.length === 0 && !showForm && (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-12)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔌</div>
                        <h3 style={{ marginBottom: 'var(--space-2)' }}>No Data Sources Connected</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto var(--space-6)' }}>
                            Connect your PostgreSQL, MySQL, or MongoDB databases to automatically discover PII and privacy risks.
                        </p>
                        {canWrite && <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Connect First Database</button>}
                    </div>
                )}
            </div>

            {/* Scan Result Modal */}
            {scanResult && (
                <div className="card card-highlight-green mt-8 animate-fade-in">
                    <div className="card-header border-b">
                        <h3>Scan Complete</h3>
                        <button className="btn btn-secondary" onClick={() => setScanResult(null)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Dismiss</button>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                            <div><span style={{ fontSize: '2rem', fontWeight: 800 }}>{scanResult.tables_found}</span><span style={{ color: 'var(--text-muted)', marginLeft: 'var(--space-2)', fontSize: '0.85rem' }}>tables discovered</span></div>
                            <div><span style={{ fontSize: '2rem', fontWeight: 800 }}>{scanResult.fields_found}</span><span style={{ color: 'var(--text-muted)', marginLeft: 'var(--space-2)', fontSize: '0.85rem' }}>fields analyzed</span></div>
                            <div><span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-red)' }}>{scanResult.pii_found}</span><span style={{ color: 'var(--text-muted)', marginLeft: 'var(--space-2)', fontSize: '0.85rem' }}>PII risks found</span></div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>All findings have been added to the Discovery page. Navigate there to review the full risk analysis.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
