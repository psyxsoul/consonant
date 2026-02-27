import { useState, useEffect } from 'react'
import api from '../services/api'

const PLAN_COLORS = {
    starter: { bg: 'var(--accent-green-dim)', color: 'var(--accent-green)' },
    professional: { bg: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)' },
    enterprise: { bg: 'var(--accent-violet-dim)', color: 'var(--accent-violet)' },
    custom: { bg: 'var(--accent-amber-dim)', color: 'var(--accent-amber)' },
}

const CATEGORY_ICONS = { Core: '🔵', Data: '🟢', AI: '🟣', Security: '🔴', Protection: '🟠', Admin: '⚪' }

export default function LicenseManager() {
    const [orgs, setOrgs] = useState([])
    const [licenses, setLicenses] = useState([])
    const [features, setFeatures] = useState([])
    const [planPresets, setPlanPresets] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Form states
    const [showOrgForm, setShowOrgForm] = useState(false)
    const [showLicForm, setShowLicForm] = useState(false)
    const [editingLicense, setEditingLicense] = useState(null)
    const [orgForm, setOrgForm] = useState({ name: '', plan: 'starter', max_users: 5 })
    const [licForm, setLicForm] = useState({ org_id: '', plan: 'starter', max_users: 5, features: [] })

    const load = async () => {
        try {
            const [o, l, f, p] = await Promise.all([api.getOrgs(), api.getLicenses(), api.getFeatures(), api.getPlanPresets()])
            setOrgs(o); setLicenses(l); setFeatures(f); setPlanPresets(p)
        } catch (err) { setError(err.message) }
        finally { setLoading(false) }
    }
    useEffect(() => { load() }, [])

    const createOrg = async (e) => {
        e.preventDefault(); setError(null)
        try {
            const org = await api.createOrg(orgForm)
            // Auto-create license for the org
            await api.createLicense({ org_id: org.id, plan: orgForm.plan, max_users: orgForm.max_users })
            setShowOrgForm(false); setOrgForm({ name: '', plan: 'starter', max_users: 5 }); load()
        } catch (err) { setError(err.message) }
    }

    const createLicense = async (e) => {
        e.preventDefault(); setError(null)
        try {
            await api.createLicense(licForm)
            setShowLicForm(false); setLicForm({ org_id: '', plan: 'starter', max_users: 5, features: [] }); load()
        } catch (err) { setError(err.message) }
    }

    const toggleFeature = async (licenseId, featureKey, currentFeatures) => {
        const updated = currentFeatures.includes(featureKey)
            ? currentFeatures.filter(f => f !== featureKey)
            : [...currentFeatures, featureKey]
        try {
            await api.updateLicenseFeatures(licenseId, updated); load()
        } catch (err) { setError(err.message) }
    }

    const applyPlan = async (licenseId, plan) => {
        const featureList = planPresets[plan]
        if (!featureList) return
        try {
            await api.updateLicenseFeatures(licenseId, featureList)
            await api.updateLicense(licenseId, { plan }); load()
        } catch (err) { setError(err.message) }
    }

    const deleteLicense = async (id) => {
        try { await api.deleteLicense(id); load() }
        catch (err) { setError(err.message) }
    }

    const deleteOrg = async (id) => {
        try { await api.deleteOrg(id); load() }
        catch (err) { setError(err.message) }
    }

    if (loading) return <div className="dash-loading"><div className="spinner" /><span>Loading License Manager...</span></div>

    return (
        <div className="animate-fade-in">
            <div className="page-header mb-8">
                <div>
                    <h1>🔑 License Manager</h1>
                    <p>Manage organizations, licenses, and feature access</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button className="btn btn-secondary" onClick={() => setShowLicForm(!showLicForm)}>+ New License</button>
                    <button className="btn btn-primary" onClick={() => setShowOrgForm(!showOrgForm)}>+ New Organization</button>
                </div>
            </div>

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}

            {/* KPI Stats */}
            <div className="dash-grid-4 mb-8">
                {[
                    { label: 'Organizations', value: orgs.length, icon: '🏢', color: 'var(--accent-cyan)' },
                    { label: 'Active Licenses', value: licenses.filter(l => l.status === 'active').length, icon: '🔑', color: 'var(--accent-green)' },
                    { label: 'Total Users', value: licenses.reduce((a, l) => a + (l.user_count || 0), 0), icon: '👥', color: 'var(--accent-violet)' },
                    { label: 'Features Available', value: features.length, icon: '⚡', color: 'var(--accent-amber)' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card">
                        <div className="kpi-label">{s.label}</div>
                        <div className="kpi-value">{s.value}</div>
                        <div className="kpi-icon" style={{ color: s.color }}>{s.icon}</div>
                    </div>
                ))}
            </div>

            {/* Create Org Form */}
            {showOrgForm && (
                <div className="card card-highlight-cyan mb-8 animate-fade-in">
                    <div className="card-header border-b"><h3>New Organization</h3></div>
                    <div className="card-body">
                        <form onSubmit={createOrg} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 'var(--space-4)', alignItems: 'end' }}>
                            <div className="form-group">
                                <label className="form-label">Organization Name</label>
                                <input className="form-input" value={orgForm.name} onChange={e => setOrgForm({ ...orgForm, name: e.target.value })} placeholder="Acme Corp" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Plan</label>
                                <select className="form-input" value={orgForm.plan} onChange={e => setOrgForm({ ...orgForm, plan: e.target.value })}>
                                    <option value="starter">Starter</option>
                                    <option value="professional">Professional</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Max Users</label>
                                <input type="number" className="form-input" value={orgForm.max_users} onChange={e => setOrgForm({ ...orgForm, max_users: parseInt(e.target.value) })} min={1} />
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowOrgForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create License Form */}
            {showLicForm && (
                <div className="card card-highlight-green mb-8 animate-fade-in">
                    <div className="card-header border-b"><h3>New License</h3></div>
                    <div className="card-body">
                        <form onSubmit={createLicense} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 'var(--space-4)', alignItems: 'end' }}>
                            <div className="form-group">
                                <label className="form-label">Organization</label>
                                <select className="form-input" value={licForm.org_id} onChange={e => setLicForm({ ...licForm, org_id: e.target.value })} required>
                                    <option value="">Select org...</option>
                                    {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Plan</label>
                                <select className="form-input" value={licForm.plan} onChange={e => setLicForm({ ...licForm, plan: e.target.value })}>
                                    <option value="starter">Starter</option>
                                    <option value="professional">Professional</option>
                                    <option value="enterprise">Enterprise</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Max Users</label>
                                <input type="number" className="form-input" value={licForm.max_users} onChange={e => setLicForm({ ...licForm, max_users: parseInt(e.target.value) })} min={1} />
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowLicForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* License Cards */}
            <div className="sidebar-section-label mb-4" style={{ fontSize: '0.8rem' }}>Active Licenses</div>
            <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                {licenses.map(lic => {
                    const planStyle = PLAN_COLORS[lic.plan] || PLAN_COLORS.custom
                    const isEditing = editingLicense === lic.id

                    return (
                        <div key={lic.id} className="card">
                            <div className="card-header border-b">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <span style={{ fontSize: '1.3rem' }}>🏢</span>
                                    <div>
                                        <h3 style={{ fontSize: '1rem' }}>{lic.org_name || lic.name}</h3>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                            {lic.org_slug} · {lic.user_count || 0} users · Max {lic.max_users}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <span style={{
                                        padding: '3px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem',
                                        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                                        background: planStyle.bg, color: planStyle.color
                                    }}>{lic.plan}</span>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem',
                                        fontWeight: 700, textTransform: 'uppercase',
                                        background: lic.status === 'active' ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
                                        color: lic.status === 'active' ? 'var(--accent-green)' : 'var(--accent-red)'
                                    }}>{lic.status}</span>
                                </div>
                            </div>

                            <div className="card-body">
                                {/* Plan preset buttons */}
                                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', alignSelf: 'center', marginRight: 'var(--space-2)' }}>APPLY PRESET:</span>
                                    {['starter', 'professional', 'enterprise'].map(plan => {
                                        const ps = PLAN_COLORS[plan]
                                        return (
                                            <button key={plan} className="btn btn-secondary" onClick={() => applyPlan(lic.id, plan)}
                                                style={{ padding: '3px 10px', fontSize: '0.7rem', borderColor: ps.color, color: ps.color }}>
                                                {plan}
                                            </button>
                                        )
                                    })}
                                    <button className="btn btn-secondary" onClick={() => setEditingLicense(isEditing ? null : lic.id)}
                                        style={{ padding: '3px 10px', fontSize: '0.7rem', marginLeft: 'auto' }}>
                                        {isEditing ? '✓ Done' : '✏️ Customize'}
                                    </button>
                                </div>

                                {/* Feature grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-2)' }}>
                                    {features.map(f => {
                                        const enabled = lic.features?.includes(f.key)
                                        return (
                                            <div key={f.key}
                                                onClick={isEditing ? () => toggleFeature(lic.id, f.key, lic.features || []) : undefined}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    borderRadius: 'var(--radius-sm)', fontSize: '0.78rem',
                                                    background: enabled ? 'var(--accent-green-dim)' : 'var(--bg-tertiary)',
                                                    border: `1px solid ${enabled ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
                                                    opacity: enabled ? 1 : 0.5,
                                                    cursor: isEditing ? 'pointer' : 'default',
                                                    transition: 'all 0.15s ease'
                                                }}>
                                                <span style={{ fontSize: '0.7rem' }}>{CATEGORY_ICONS[f.category] || '⚪'}</span>
                                                <span style={{ flex: 1, fontWeight: enabled ? 600 : 400 }}>{f.name}</span>
                                                <span style={{ fontSize: '0.8rem' }}>{enabled ? '✅' : '❌'}</span>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        {lic.features?.length || 0}/{features.length} features · Created {new Date(lic.created_at).toLocaleDateString('en-IN')}
                                        {lic.expires_at && ` · Expires ${new Date(lic.expires_at).toLocaleDateString('en-IN')}`}
                                    </span>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        <button className="btn btn-secondary" onClick={() => deleteLicense(lic.id)}
                                            style={{ padding: '4px 12px', fontSize: '0.7rem', color: 'var(--accent-red)' }}>
                                            Revoke License
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {licenses.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔑</div>
                        <h3>No Licenses Yet</h3>
                        <p style={{ color: 'var(--text-muted)', margin: 'var(--space-2) auto var(--space-6)', maxWidth: '400px' }}>
                            Create an organization first, then assign a license with feature access.
                        </p>
                        <button className="btn btn-primary" onClick={() => setShowOrgForm(true)}>+ Create First Organization</button>
                    </div>
                )}
            </div>
        </div>
    )
}
