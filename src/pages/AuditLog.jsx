import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function AuditLog() {
    const [logs, setLogs] = useState([])
    const [stats, setStats] = useState({})
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({})
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')
    const { isOwner } = useAuth()

    const load = async (p = 1) => {
        setLoading(true)
        try {
            const [logData, statsData] = await Promise.all([
                api.getAuditLog(p, 50, filter ? { action: filter } : {}),
                api.getAuditStats()
            ])
            setLogs(logData.data)
            setPagination(logData.pagination)
            setStats(statsData)
        } catch (err) {
            console.error('Failed to load audit log:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load(page) }, [page, filter])

    const actionColor = (action) => {
        if (action.includes('failed')) return 'var(--accent-red)'
        if (action.includes('login')) return 'var(--accent-green)'
        if (action.includes('register')) return 'var(--accent-cyan)'
        if (action.includes('delete') || action.includes('remove')) return 'var(--accent-red)'
        if (action.includes('update') || action.includes('toggle')) return 'var(--accent-amber)'
        if (action.includes('create') || action.includes('scan')) return 'var(--accent-violet)'
        return 'var(--text-secondary)'
    }

    if (loading && logs.length === 0) return <div className="dash-loading"><div className="spinner" /><span>Loading Audit Trail...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>Audit Trail</h1>
                    <p>Immutable record of every action on the platform</p>
                </div>
                {isOwner && (
                    <a href={api.exportAuditLog()} className="btn btn-secondary" target="_blank" rel="noreferrer">
                        📥 Export CSV
                    </a>
                )}
            </div>

            {/* Stats */}
            <div className="dash-grid-4 mb-8">
                {[
                    { label: 'Total Events', value: stats.total?.toLocaleString() || '0', icon: '📋', color: 'var(--accent-cyan)' },
                    { label: 'Today', value: stats.today?.toLocaleString() || '0', icon: '📅', color: 'var(--accent-green)' },
                    { label: 'Total Logins', value: stats.logins?.toLocaleString() || '0', icon: '🔑', color: 'var(--accent-violet)' },
                    { label: 'Failed Logins', value: stats.failedLogins?.toLocaleString() || '0', icon: '🚫', color: 'var(--accent-red)' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card">
                        <div className="kpi-label">{s.label}</div>
                        <div className="kpi-value">{s.value}</div>
                        <div className="kpi-icon" style={{ color: s.color }}>{s.icon}</div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="card mb-6">
                <div className="card-body" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>
                    {['', 'login', 'register', 'create', 'update', 'delete', 'toggle', 'failed'].map(f => (
                        <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                            onClick={() => { setFilter(f); setPage(1) }}>
                            {f || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Log Table */}
            <div className="card">
                <div className="card-body p-0">
                    <table className="data-table" style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '160px' }}>Timestamp</th>
                                <th style={{ width: '180px' }}>User</th>
                                <th>Action</th>
                                <th style={{ width: '100px' }}>Resource</th>
                                <th>Details</th>
                                <th style={{ width: '120px' }}>IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                                        {new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'medium' })}
                                    </td>
                                    <td style={{ fontSize: '0.8rem' }}>{log.user_email || '—'}</td>
                                    <td>
                                        <span style={{
                                            fontSize: '0.75rem', fontWeight: 600, color: actionColor(log.action),
                                            background: `${actionColor(log.action)}15`, padding: '2px 8px',
                                            borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)'
                                        }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {log.resource_type || '—'}
                                    </td>
                                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {log.details || '—'}
                                    </td>
                                    <td style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                                        {log.ip_address || '—'}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>No audit events found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Page {pagination.page} of {pagination.totalPages} ({pagination.total} events)
                        </span>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <button className="btn btn-secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                                style={{ padding: '4px 12px', fontSize: '0.8rem' }}>← Prev</button>
                            <button className="btn btn-secondary" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}
                                style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Next →</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
