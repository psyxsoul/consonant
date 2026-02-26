import { useState } from 'react'

const guardrails = [
    { id: 'gr-1', name: 'Aadhaar Auto-Masking', desc: 'Automatically detect and mask Aadhaar numbers in logs, exports, and API responses', status: true, category: 'Data Masking' },
    { id: 'gr-2', name: 'PAN Tokenization', desc: 'Replace PAN card numbers with irreversible tokens in non-production environments', status: true, category: 'Tokenization' },
    { id: 'gr-3', name: 'AI Prompt Redaction Proxy', desc: 'Intercept employee prompts to external LLMs, strip PII and company data before sending', status: true, category: 'AI Proxy' },
    { id: 'gr-4', name: 'Privacy Vault — Financial Data', desc: 'Isolate sensitive financial records in encrypted privacy vault with audit logging', status: true, category: 'Privacy Vault' },
    { id: 'gr-5', name: 'Email Address Obfuscation', desc: 'Mask email addresses in staging and development database clones', status: false, category: 'Data Masking' },
    { id: 'gr-6', name: 'Cross-border Transfer Block', desc: 'Block data transfers to non-approved jurisdictions per DPDPA requirements', status: true, category: 'Transfer Control' },
    { id: 'gr-7', name: 'Automated Data Minimization', desc: 'Identify and flag data retained beyond its stated purpose window', status: false, category: 'Data Minimization' },
]

const proxyLog = [
    { time: '14:32', user: 'Rahul M.', model: 'GPT-4o', fieldsRedacted: 12, types: ['Customer Names', 'Email Addresses', 'Phone Numbers'] },
    { time: '14:28', user: 'Sneha K.', model: 'Claude 3.5', fieldsRedacted: 3, types: ['Internal Revenue Figures'] },
    { time: '14:15', user: 'Amit P.', model: 'GPT-4o', fieldsRedacted: 8, types: ['Employee SSN', 'Salary Data'] },
    { time: '13:58', user: 'Divya R.', model: 'Gemini 2.0', fieldsRedacted: 5, types: ['Customer Addresses', 'Order IDs'] },
    { time: '13:42', user: 'Rohit S.', model: 'GPT-4o', fieldsRedacted: 1, types: ['API Secret Key'] },
]

const vaultItems = [
    { name: 'Financial Records Vault', records: '23,401', encrypted: true, lastAccess: '2 hours ago', size: '2.4 GB' },
    { name: 'PII Quarantine Zone', records: '8,742', encrypted: true, lastAccess: '45 min ago', size: '890 MB' },
    { name: 'HR Sensitive Data Vault', records: '1,240', encrypted: true, lastAccess: '1 day ago', size: '340 MB' },
]

export default function Guardrails() {
    const [toggles, setToggles] = useState(
        Object.fromEntries(guardrails.map(g => [g.id, g.status]))
    )

    const toggle = (id) => {
        setToggles(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Active Guardrails</h1>
                    <p className="page-header-subtitle">Automated privacy defense — masking, tokenization, vaults, and AI proxy</p>
                </div>
                <button className="btn btn-primary">+ Add Guardrail</button>
            </div>

            {/* Summary */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card">
                    <div className="stat-card-value">{guardrails.length}</div>
                    <div className="stat-card-label">Total Guardrails</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value" style={{ color: 'var(--accent-green)' }}>
                        {Object.values(toggles).filter(Boolean).length}
                    </div>
                    <div className="stat-card-label">Active</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value" style={{ color: 'var(--accent-cyan)' }}>
                        {proxyLog.reduce((sum, l) => sum + l.fieldsRedacted, 0)}
                    </div>
                    <div className="stat-card-label">Fields Redacted Today</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-value">{vaultItems.length}</div>
                    <div className="stat-card-label">Privacy Vaults</div>
                </div>
            </div>

            <div className="grid-2">
                {/* Guardrail List */}
                <div>
                    <div className="dash-panel">
                        <div className="dash-panel-header">
                            <h3>Defense Configuration</h3>
                        </div>
                        {guardrails.map((g) => (
                            <div className="guardrail-card" key={g.id}>
                                <div className={`guardrail-status ${toggles[g.id] ? 'active' : 'inactive'}`} />
                                <div className="guardrail-info">
                                    <h4>{g.name}</h4>
                                    <p>{g.desc}</p>
                                    <span className="badge badge-violet" style={{ marginTop: 4, fontSize: '0.65rem' }}>{g.category}</span>
                                </div>
                                <div
                                    className={`guardrail-toggle ${toggles[g.id] ? 'on' : ''}`}
                                    onClick={() => toggle(g.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    {/* AI Proxy Log */}
                    <div className="dash-panel">
                        <div className="dash-panel-header">
                            <h3>AI Proxy Redaction Log</h3>
                            <span className="badge badge-green">● Live</span>
                        </div>
                        {proxyLog.map((entry, i) => (
                            <div className="activity-item" key={i}>
                                <span className="activity-dot cyan" />
                                <div style={{ flex: 1 }}>
                                    <div className="activity-text">
                                        <strong>{entry.user}</strong> → {entry.model}
                                        <span style={{ marginLeft: 8 }} className="badge badge-red">{entry.fieldsRedacted} redacted</span>
                                    </div>
                                    <div className="flex gap-2" style={{ marginTop: 4, flexWrap: 'wrap' }}>
                                        {entry.types.map((t, j) => (
                                            <span key={j} className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{t}</span>
                                        ))}
                                    </div>
                                    <div className="activity-time">{entry.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Privacy Vaults */}
                    <div className="dash-panel">
                        <div className="dash-panel-header">
                            <h3>Privacy Vaults</h3>
                        </div>
                        {vaultItems.map((v, i) => (
                            <div className="guardrail-card" key={i}>
                                <div style={{
                                    width: 40, height: 40, minWidth: 40, borderRadius: 'var(--radius-sm)',
                                    background: 'var(--accent-violet-dim)', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '1.2rem'
                                }}>
                                    🔒
                                </div>
                                <div className="guardrail-info" style={{ flex: 1 }}>
                                    <h4>{v.name}</h4>
                                    <p>{v.records} records · {v.size} · Last access: {v.lastAccess}</p>
                                </div>
                                <span className="badge badge-green">🔐 Encrypted</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
