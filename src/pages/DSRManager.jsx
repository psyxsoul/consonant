const dsrRequests = [
    {
        id: 'DSR-1247', type: 'Erasure', subject: 'Priya Sharma', email: 'priya.s@email.com',
        status: 'in-progress', priority: 'High', submitted: '2026-02-24', deadline: '2026-03-24',
        locations: ['PostgreSQL: prod_db', 'S3: user-uploads/', 'Salesforce CRM'],
        progress: 65
    },
    {
        id: 'DSR-1246', type: 'Access', subject: 'Rajesh Kumar', email: 'r.kumar@company.in',
        status: 'pending', priority: 'Medium', submitted: '2026-02-23', deadline: '2026-03-23',
        locations: ['PostgreSQL: prod_db', 'MongoDB: support_db'],
        progress: 20
    },
    {
        id: 'DSR-1245', type: 'Portability', subject: 'Anita Desai', email: 'anita.d@mail.com',
        status: 'in-progress', priority: 'Medium', submitted: '2026-02-22', deadline: '2026-03-22',
        locations: ['PostgreSQL: prod_db', 'Elasticsearch: logs', 'Redis: cache'],
        progress: 80
    },
    {
        id: 'DSR-1244', type: 'Erasure', subject: 'Vikram Singh', email: 'v.singh@inbox.com',
        status: 'completed', priority: 'Low', submitted: '2026-02-15', deadline: '2026-03-15',
        locations: ['PostgreSQL: prod_db'],
        progress: 100
    },
    {
        id: 'DSR-1243', type: 'Rectification', subject: 'Meera Patel', email: 'meera.p@org.in',
        status: 'in-progress', priority: 'High', submitted: '2026-02-20', deadline: '2026-03-20',
        locations: ['PostgreSQL: prod_db', 'PostgreSQL: hr_db'],
        progress: 45
    },
    {
        id: 'DSR-1242', type: 'Access', subject: 'Arjun Nair', email: 'arjun.n@provider.com',
        status: 'completed', priority: 'Low', submitted: '2026-02-10', deadline: '2026-03-10',
        locations: ['PostgreSQL: prod_db', 'S3: archives/'],
        progress: 100
    },
]

const typeBadge = (type) => {
    const map = { Erasure: 'badge-red', Access: 'badge-cyan', Portability: 'badge-violet', Rectification: 'badge-amber' }
    return map[type] || 'badge-cyan'
}
const statusLabel = (s) => {
    const map = { 'pending': 'Pending', 'in-progress': 'In Progress', 'completed': 'Completed' }
    return map[s] || s
}

export default function DSRManager() {
    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>DSR Management</h1>
                    <p className="page-header-subtitle">Track and fulfill Data Subject Rights requests across all data silos</p>
                </div>
                <button className="btn btn-primary">+ Log New Request</button>
            </div>

            {/* Summary */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card">
                    <div className="stat-card-value">{dsrRequests.length}</div>
                    <div className="stat-card-label">Total Requests</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value" style={{ color: 'var(--accent-amber)' }}>
                        {dsrRequests.filter(r => r.status === 'in-progress').length}
                    </div>
                    <div className="stat-card-label">In Progress</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>
                        {dsrRequests.filter(r => r.status === 'pending').length}
                    </div>
                    <div className="stat-card-label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>
                        {dsrRequests.filter(r => r.status === 'completed').length}
                    </div>
                    <div className="stat-card-label">Completed</div>
                </div>
            </div>

            {/* DSR Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {dsrRequests.map((dsr) => (
                    <div key={dsr.id} className="dash-panel" style={{ marginBottom: 0 }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-4)' }}>
                            <div className="flex items-center gap-4">
                                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>{dsr.id}</span>
                                <span className={`badge ${typeBadge(dsr.type)}`}>{dsr.type}</span>
                                {dsr.priority === 'High' && <span className="badge badge-red">⚡ High Priority</span>}
                            </div>
                            <div className="flex items-center gap-3">
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Deadline: {dsr.deadline}
                                </span>
                                <span className={`badge ${dsr.status === 'completed' ? 'badge-green' : dsr.status === 'in-progress' ? 'badge-amber' : 'badge-cyan'}`}>
                                    {statusLabel(dsr.status)}
                                </span>
                            </div>
                        </div>

                        <div className="grid-3" style={{ marginBottom: 'var(--space-4)' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Data Subject</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{dsr.subject}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dsr.email}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Data Locations</div>
                                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                    {dsr.locations.map((loc, i) => (
                                        <span key={i} className="badge badge-violet" style={{ fontSize: '0.7rem' }}>{loc}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Submitted</div>
                                <div style={{ fontSize: '0.9rem' }}>{dsr.submitted}</div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between" style={{ marginBottom: 'var(--space-1)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fulfillment Progress</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dsr.progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{
                                    width: `${dsr.progress}%`,
                                    background: dsr.progress === 100 ? 'var(--accent-green)' : undefined
                                }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
