const dataFlowStages = [
    { icon: '🌐', title: 'Data Ingestion', desc: 'Web forms, APIs, mobile apps, third-party imports', sources: 14 },
    { icon: '🔄', title: 'Processing', desc: 'Application servers, ETL pipelines, ML training', systems: 8 },
    { icon: '💾', title: 'Storage', desc: 'PostgreSQL, S3, Redis cache, Elasticsearch', stores: 6 },
    { icon: '📤', title: 'Sharing', desc: 'Analytics vendors, payment gateways, CRM', partners: 5 },
    { icon: '🗑️', title: 'Retention / Deletion', desc: 'Automated retention policies, scheduled purges', policies: 12 },
]

const ropaEntries = [
    { activity: 'User Registration', data: 'Name, Email, Phone, Aadhaar', purpose: 'Account Creation', basis: 'Consent', retention: '5 years', risk: 'Medium' },
    { activity: 'Payment Processing', data: 'Card Number, UPI ID, Billing Address', purpose: 'Transaction Fulfillment', basis: 'Contract', retention: '7 years', risk: 'High' },
    { activity: 'Marketing Analytics', data: 'IP, Device ID, Browsing History', purpose: 'Product Improvement', basis: 'Legitimate Interest', retention: '2 years', risk: 'Medium' },
    { activity: 'Customer Support', data: 'Name, Email, Chat Transcripts', purpose: 'Service Delivery', basis: 'Contract', retention: '3 years', risk: 'Low' },
    { activity: 'Employee HR Data', data: 'Full Name, PAN, Salary, Address', purpose: 'HR Management', basis: 'Legal Obligation', retention: '8 years', risk: 'High' },
    { activity: 'Third-Party Sharing', data: 'Email, Purchase History', purpose: 'Partner Marketing', basis: 'Consent', retention: '1 year', risk: 'Critical' },
]

const riskColor = (risk) => {
    const map = { Critical: 'badge-red', High: 'badge-amber', Medium: 'badge-cyan', Low: 'badge-green' }
    return map[risk] || 'badge-cyan'
}

export default function DataMap() {
    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Data Map & RoPA</h1>
                    <p className="page-header-subtitle">Live Record of Processing Activities across your entire architecture</p>
                </div>
                <button className="btn btn-primary">↻ Refresh Map</button>
            </div>

            {/* Data Flow Visualization */}
            <div className="dash-panel">
                <div className="dash-panel-header">
                    <h3>Data Flow Architecture</h3>
                    <span className="badge badge-green">Live</span>
                </div>
                <div className="dataflow-container">
                    {dataFlowStages.map((stage, i) => (
                        <div className="dataflow-stage" key={i}>
                            <div className="dataflow-stage-icon">{stage.icon}</div>
                            <h4>{stage.title}</h4>
                            <p>{stage.desc}</p>
                            <div style={{ marginTop: 'var(--space-3)' }}>
                                <span className="badge badge-cyan">
                                    {stage.sources || stage.systems || stage.stores || stage.partners || stage.policies} {
                                        stage.sources ? 'sources' :
                                            stage.systems ? 'systems' :
                                                stage.stores ? 'stores' :
                                                    stage.partners ? 'partners' : 'policies'
                                    }
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RoPA Table */}
            <div className="dash-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="dash-panel-header" style={{ padding: 'var(--space-5) var(--space-6)' }}>
                    <h3>Record of Processing Activities (RoPA)</h3>
                    <button className="btn btn-ghost">Export PDF</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Processing Activity</th>
                            <th>Data Categories</th>
                            <th>Purpose</th>
                            <th>Legal Basis</th>
                            <th>Retention</th>
                            <th>Risk Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ropaEntries.map((r, i) => (
                            <tr key={i}>
                                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.activity}</td>
                                <td>{r.data}</td>
                                <td>{r.purpose}</td>
                                <td><span className="badge badge-violet">{r.basis}</span></td>
                                <td>{r.retention}</td>
                                <td><span className={`badge ${riskColor(r.risk)}`}>{r.risk}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary Stats */}
            <div className="grid-3" style={{ marginTop: 'var(--space-6)' }}>
                <div className="stat-card">
                    <div className="stat-card-value">142</div>
                    <div className="stat-card-label">Database Tables Mapped</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value">33</div>
                    <div className="stat-card-label">Connected Systems</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>98%</div>
                    <div className="stat-card-label">Map Coverage</div>
                </div>
            </div>
        </div>
    )
}
