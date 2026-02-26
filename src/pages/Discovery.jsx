const scanResults = [
    { field: 'users.aadhaar_number', type: 'Aadhaar Number', source: 'PostgreSQL: prod_db', confidence: '99.2%', severity: 'Critical', context: 'Stored in plaintext, no encryption detected' },
    { field: 'customers.pan_card', type: 'PAN Card', source: 'PostgreSQL: prod_db', confidence: '98.7%', severity: 'Critical', context: 'Linked to payment table via customer_id' },
    { field: 'analytics.device_fingerprint', type: 'Device Fingerprint', source: 'Elasticsearch: logs', confidence: '94.1%', severity: 'High', context: 'Linkability risk — can be combined with IP for identification' },
    { field: 'users.email + users.phone', type: 'Linkability Risk', source: 'PostgreSQL: prod_db', confidence: '91.5%', severity: 'High', context: 'Email + phone combination creates unique identifier' },
    { field: 'support_tickets.transcript', type: 'Free Text PII', source: 'MongoDB: support_db', confidence: '87.3%', severity: 'Medium', context: 'Chat transcripts contain names, emails, and addresses' },
    { field: 'hr.employee_salary', type: 'Sensitive Financial', source: 'PostgreSQL: hr_db', confidence: '99.8%', severity: 'High', context: 'Salary data with PAN and bank account details' },
    { field: 'logs.user_agent', type: 'Browser Fingerprint', source: 'S3: access_logs/', confidence: '78.4%', severity: 'Low', context: 'User agent strings alone have limited linkability' },
    { field: 'marketing.cookie_ids', type: 'Tracking Identifier', source: 'Redis: session_cache', confidence: '96.2%', severity: 'Medium', context: 'Third-party cookie ID mapped to user profiles' },
]

const severityBadge = (sev) => {
    const map = { Critical: 'badge-red', High: 'badge-amber', Medium: 'badge-cyan', Low: 'badge-green' }
    return map[sev] || 'badge-cyan'
}

export default function Discovery() {
    const criticalCount = scanResults.filter(r => r.severity === 'Critical').length
    const highCount = scanResults.filter(r => r.severity === 'High').length
    const mediumCount = scanResults.filter(r => r.severity === 'Medium').length
    const lowCount = scanResults.filter(r => r.severity === 'Low').length

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Semantic Discovery</h1>
                    <p className="page-header-subtitle">AI-powered PII detection with context-aware intent analysis</p>
                </div>
                <button className="btn btn-primary">🔍 Run New Scan</button>
            </div>

            {/* Risk Summary */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'var(--accent-red-dim)' }}>🔴</div>
                    </div>
                    <div className="stat-card-value" style={{ color: 'var(--accent-red)' }}>{criticalCount}</div>
                    <div className="stat-card-label">Critical Findings</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'var(--accent-amber-dim)' }}>🟠</div>
                    </div>
                    <div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>{highCount}</div>
                    <div className="stat-card-label">High Risk</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'var(--accent-cyan-dim)' }}>🔵</div>
                    </div>
                    <div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>{mediumCount}</div>
                    <div className="stat-card-label">Medium Risk</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'var(--accent-green-dim)' }}>🟢</div>
                    </div>
                    <div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>{lowCount}</div>
                    <div className="stat-card-label">Low Risk</div>
                </div>
            </div>

            {/* Risk Meter */}
            <div className="dash-panel">
                <div className="dash-panel-header">
                    <h3>Overall Risk Distribution</h3>
                    <span className="badge badge-amber">Needs Attention</span>
                </div>
                <div className="risk-meter" style={{ height: 12, borderRadius: 6 }}>
                    <div className="risk-meter-bar" style={{ flex: criticalCount, background: 'var(--accent-red)', borderRadius: '6px 0 0 6px' }} />
                    <div className="risk-meter-bar" style={{ flex: highCount, background: 'var(--accent-amber)' }} />
                    <div className="risk-meter-bar" style={{ flex: mediumCount, background: 'var(--accent-cyan)' }} />
                    <div className="risk-meter-bar" style={{ flex: lowCount, background: 'var(--accent-green)', borderRadius: '0 6px 6px 0' }} />
                </div>
                <div className="flex justify-between" style={{ marginTop: 'var(--space-2)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Critical ({criticalCount})</span>
                    <span>High ({highCount})</span>
                    <span>Medium ({mediumCount})</span>
                    <span>Low ({lowCount})</span>
                </div>
            </div>

            {/* Scan Results Table */}
            <div className="dash-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="dash-panel-header" style={{ padding: 'var(--space-5) var(--space-6)' }}>
                    <h3>Scan Results — Latest Run</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Last scan: 2 hours ago · 142 tables · 4 data sources
                    </span>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Field / Location</th>
                            <th>PII Type</th>
                            <th>Source</th>
                            <th>Confidence</th>
                            <th>Severity</th>
                            <th>Context</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scanResults.map((r, i) => (
                            <tr key={i}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{r.field}</td>
                                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.type}</td>
                                <td style={{ fontSize: '0.8rem' }}>{r.source}</td>
                                <td style={{ fontWeight: 600 }}>{r.confidence}</td>
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
