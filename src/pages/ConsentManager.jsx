import { useState } from 'react'

const consentRecords = [
    { id: 'CN-0421', purpose: 'Marketing Communications', subjects: '12,847', basis: 'Consent', status: 'active', created: '2026-01-15', expires: '2027-01-15' },
    { id: 'CN-0420', purpose: 'Analytics & Product Improvement', subjects: '45,210', basis: 'Legitimate Interest', status: 'active', created: '2026-01-10', expires: '2027-01-10' },
    { id: 'CN-0419', purpose: 'Third-Party Data Sharing', subjects: '8,392', basis: 'Consent', status: 'pending', created: '2026-01-08', expires: '—' },
    { id: 'CN-0418', purpose: 'Transaction Processing', subjects: '67,431', basis: 'Contract', status: 'active', created: '2025-12-20', expires: '2026-12-20' },
    { id: 'CN-0417', purpose: 'Employee Background Checks', subjects: '1,240', basis: 'Legal Obligation', status: 'active', created: '2025-12-15', expires: '2026-12-15' },
    { id: 'CN-0416', purpose: 'Promotional Campaigns Q4', subjects: '22,180', basis: 'Consent', status: 'expired', created: '2025-09-01', expires: '2025-12-31' },
    { id: 'CN-0415', purpose: 'Customer Feedback Collection', subjects: '5,673', basis: 'Consent', status: 'revoked', created: '2025-08-20', expires: '—' },
    { id: 'CN-0414', purpose: 'Children\'s Data — Parental Consent', subjects: '342', basis: 'Guardian Consent', status: 'active', created: '2025-11-10', expires: '2026-11-10' },
]

const filters = ['All', 'Active', 'Pending', 'Expired', 'Revoked']

export default function ConsentManager() {
    const [activeFilter, setActiveFilter] = useState('All')

    const filtered = activeFilter === 'All'
        ? consentRecords
        : consentRecords.filter(r => r.status === activeFilter.toLowerCase())

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Consent Orchestration</h1>
                    <p className="page-header-subtitle">Verifiable consent records linked to every data asset</p>
                </div>
                <button className="btn btn-primary">+ New Consent Notice</button>
            </div>

            {/* Summary Stats */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card">
                    <div className="stat-card-value">{consentRecords.length}</div>
                    <div className="stat-card-label">Total Notices</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>
                        {consentRecords.filter(r => r.status === 'active').length}
                    </div>
                    <div className="stat-card-label">Active</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>
                        {consentRecords.filter(r => r.status === 'pending').length}
                    </div>
                    <div className="stat-card-label">Pending Review</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value" style={{ color: 'var(--accent-red)' }}>
                        {consentRecords.filter(r => r.status === 'expired' || r.status === 'revoked').length}
                    </div>
                    <div className="stat-card-label">Expired / Revoked</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                {filters.map(f => (
                    <button
                        key={f}
                        className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
                        onClick={() => setActiveFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Consent Table */}
            <div className="dash-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Notice ID</th>
                            <th>Purpose</th>
                            <th>Data Subjects</th>
                            <th>Legal Basis</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Expires</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((r) => (
                            <tr key={r.id}>
                                <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{r.id}</td>
                                <td style={{ color: 'var(--text-primary)' }}>{r.purpose}</td>
                                <td>{r.subjects}</td>
                                <td>
                                    <span className="badge badge-violet">{r.basis}</span>
                                </td>
                                <td>
                                    <span className={`status-dot ${r.status}`} />
                                    <span style={{ textTransform: 'capitalize' }}>{r.status}</span>
                                </td>
                                <td>{r.created}</td>
                                <td>{r.expires}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
