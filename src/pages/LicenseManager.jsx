import { useState, useEffect } from 'react'
import api from '../services/api'

const PLAN_COLORS = {
    starter: { bg: 'var(--accent-green-dim)', color: 'var(--accent-green)', label: 'Starter' },
    professional: { bg: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)', label: 'Professional' },
    enterprise: { bg: 'var(--accent-violet-dim)', color: 'var(--accent-violet)', label: 'Enterprise' },
    custom: { bg: 'var(--accent-amber-dim)', color: 'var(--accent-amber)', label: 'Custom' },
}

const CATEGORY_ICONS = { Core: '🔵', Data: '🟢', AI: '🟣', Security: '🔴', Protection: '🟠', Admin: '⚪' }

export default function LicenseManager() {
    const [orgs, setOrgs] = useState([])
    const [features, setFeatures] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    // Create org form
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        name: '', admin_name: '', admin_email: '', max_users: 10, features: []
    })

    // Editing features on existing org
    const [editingOrg, setEditingOrg] = useState(null)

    const load = async () => {
        try {
            const [o, f] = await Promise.all([api.getOrgs(), api.getFeatures()])
            setOrgs(o); setFeatures(f)
        } catch (err) { setError(err.message) }
        finally { setLoading(false) }
    }
    useEffect(() => { load() }, [])

    // Plan presets
    const presets = {
        starter: ['discovery', 'datamap', 'consent', 'dsr'],
        professional: ['discovery', 'datamap', 'consent', 'dsr', 'guardrails', 'connectors', 'vera', 'audit', 'rbac'],
        enterprise: features.map(f => f.key)
    }

    const applyPreset = (plan) => {
        setForm(prev => ({ ...prev, features: presets[plan] || [] }))
    }

    const toggleFeature = (key) => {
        setForm(prev => ({
            ...prev,
            features: prev.features.includes(key)
                ? prev.features.filter(f => f !== key)
                : [...prev.features, key]
        }))
    }

    const createOrg = async (e) => {
        e.preventDefault(); setError(null); setSuccess(null)
        if (form.features.length === 0) return setError('Select at least one feature')
        try {
            const result = await api.createOrg(form)
            setSuccess(`✅ Organization "${result.name}" created! Login URL: ${result.login_url} — Invite sent to ${form.admin_email}`)
            setShowForm(false)
            setForm({ name: '', admin_name: '', admin_email: '', max_users: 10, features: [] })
            load()
        } catch (err) { setError(err.message) }
    }

    const updateOrgFeatures = async (orgId, newFeatures) => {
        try {
            await api.updateOrgFeatures(orgId, newFeatures)
            setEditingOrg(null); load()
        } catch (err) { setError(err.message) }
    }

    const toggleOrgFeature = (orgId, key, currentFeatures) => {
        const updated = currentFeatures.includes(key)
            ? currentFeatures.filter(f => f !== key)
            : [...currentFeatures, key]
        // Update local state for immediate UI feedback
        setOrgs(prev => prev.map(o => o.id === orgId ? { ...o, features: updated } : o))
    }

    const deleteOrg = async (id, name) => {
        if (!confirm(`Delete organization "${name}"? This will remove all users and licenses.`)) return
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
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    + New Organization
                </button>
            </div>

            {error && <div className="error-banner mb-6">{error}<button onClick={() => setError(null)}>✕</button></div>}
            {success && (
                <div style={{
                    padding: 'var(--space-4)', marginBottom: 'var(--space-6)',
                    borderRadius: 'var(--radius-md)', background: 'var(--accent-green-dim)',
                    border: '1px solid var(--accent-green)', color: 'var(--accent-green)',
                    fontSize: '0.85rem', fontWeight: 600
                }}>
                    {success}
                    <button onClick={() => setSuccess(null)} style={{
                        float: 'right', background: 'none', border: 'none',
                        color: 'var(--accent-green)', cursor: 'pointer', fontWeight: 700
                    }}>✕</button>
                </div>
            )}

            {/* KPI Stats */}
            <div className="dash-grid-4 mb-8">
                {[
                    { label: 'Organizations', value: orgs.length, icon: '🏢', color: 'var(--accent-cyan)' },
                    { label: 'Active Licenses', value: orgs.filter(o => o.license_status === 'active').length, icon: '🔑', color: 'var(--accent-green)' },
                    { label: 'Total Users', value: orgs.reduce((a, o) => a + (o.user_count || 0), 0), icon: '👥', color: 'var(--accent-violet)' },
                    { label: 'Features Available', value: features.length, icon: '⚡', color: 'var(--accent-amber)' },
                ].map((s, i) => (
                    <div key={i} className="kpi-card">
                        <div className="kpi-label">{s.label}</div>
                        <div className="kpi-value">{s.value}</div>
                        <div className="kpi-icon" style={{ color: s.color }}>{s.icon}</div>
                    </div>
                ))}
            </div>

            {/* Create Organization Form */}
            {showForm && (
                <div className="card card-highlight-cyan mb-8 animate-fade-in">
                    <div className="card-header border-b"><h3>New Organization</h3></div>
                    <div className="card-body">
                        <form onSubmit={createOrg}>
                            {/* Org details row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                                <div className="form-group">
                                    <label className="form-label">Organization Name</label>
                                    <input className="form-input" value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="Acme Corp" required />
                                    {form.name && (
                                        <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4px', display: 'block' }}>
                                            Slug: <code>{form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}</code>
                                        </small>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Users</label>
                                    <input type="number" className="form-input" value={form.max_users}
                                        onChange={e => setForm({ ...form, max_users: parseInt(e.target.value) })} min={1} />
                                </div>
                            </div>

                            {/* Admin details row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                                <div className="form-group">
                                    <label className="form-label">Admin Name</label>
                                    <input className="form-input" value={form.admin_name}
                                        onChange={e => setForm({ ...form, admin_name: e.target.value })}
                                        placeholder="John Doe" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Admin Email</label>
                                    <input type="email" className="form-input" value={form.admin_email}
                                        onChange={e => setForm({ ...form, admin_email: e.target.value })}
                                        placeholder="john@acme.com" required />
                                    <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4px', display: 'block' }}>
                                        A welcome email with password setup link will be sent
                                    </small>
                                </div>
                            </div>

                            {/* Plan presets */}
                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <label className="form-label">Quick Presets</label>
                                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                                    {Object.entries(presets).map(([plan, fList]) => {
                                        const ps = PLAN_COLORS[plan]
                                        const isActive = fList.length === form.features.length && fList.every(f => form.features.includes(f))
                                        return (
                                            <button key={plan} type="button" className="btn btn-secondary" onClick={() => applyPreset(plan)}
                                                style={{
                                                    padding: '6px 16px', fontSize: '0.75rem',
                                                    borderColor: isActive ? ps.color : undefined,
                                                    background: isActive ? ps.bg : undefined,
                                                    color: isActive ? ps.color : undefined
                                                }}>
                                                {ps.label} ({fList.length})
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Feature checkboxes */}
                            <div style={{ marginBottom: 'var(--space-6)' }}>
                                <label className="form-label">Features ({form.features.length}/{features.length} selected)</label>
                                <div style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                    gap: 'var(--space-2)', marginTop: 'var(--space-2)'
                                }}>
                                    {features.map(f => {
                                        const checked = form.features.includes(f.key)
                                        return (
                                            <label key={f.key}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    borderRadius: 'var(--radius-sm)', fontSize: '0.78rem',
                                                    background: checked ? 'var(--accent-green-dim)' : 'var(--bg-tertiary)',
                                                    border: `1px solid ${checked ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
                                                    cursor: 'pointer', transition: 'all 0.15s ease',
                                                    userSelect: 'none'
                                                }}>
                                                <input type="checkbox" checked={checked}
                                                    onChange={() => toggleFeature(f.key)}
                                                    style={{ accentColor: 'var(--accent-green)', width: '16px', height: '16px' }} />
                                                <span style={{ fontSize: '0.7rem' }}>{CATEGORY_ICONS[f.category] || '⚪'}</span>
                                                <div>
                                                    <div style={{ fontWeight: checked ? 600 : 400 }}>{f.name}</div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{f.description}</div>
                                                </div>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Creating org will auto-generate a license and send invite email
                                </span>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Create Organization</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Organization cards */}
            <div className="sidebar-section-label mb-4" style={{ fontSize: '0.8rem' }}>Organizations & Licenses</div>
            <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                {orgs.map(org => {
                    const planStyle = PLAN_COLORS[org.license_plan || org.plan] || PLAN_COLORS.custom
                    const isEditing = editingOrg === org.id

                    return (
                        <div key={org.id} className="card">
                            <div className="card-header border-b">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <span style={{ fontSize: '1.3rem' }}>🏢</span>
                                    <div>
                                        <h3 style={{ fontSize: '1rem' }}>{org.name}</h3>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                            /{org.slug} · {org.user_count || 0} users · Max {org.license_max_users || org.max_users}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <span style={{
                                        padding: '3px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem',
                                        fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                                        background: planStyle.bg, color: planStyle.color
                                    }}>{org.license_plan || org.plan}</span>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem',
                                        fontWeight: 700, textTransform: 'uppercase',
                                        background: org.license_status === 'active' ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
                                        color: org.license_status === 'active' ? 'var(--accent-green)' : 'var(--accent-red)'
                                    }}>{org.license_status || 'no license'}</span>
                                </div>
                            </div>

                            <div className="card-body">
                                {/* Edit toggle */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                        {org.features?.length || 0}/{features.length} FEATURES ENABLED
                                    </span>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        {isEditing && (
                                            <button className="btn btn-primary" onClick={() => updateOrgFeatures(org.id, org.features)}
                                                style={{ padding: '3px 10px', fontSize: '0.7rem' }}>Save</button>
                                        )}
                                        <button className="btn btn-secondary" onClick={() => setEditingOrg(isEditing ? null : org.id)}
                                            style={{ padding: '3px 10px', fontSize: '0.7rem' }}>
                                            {isEditing ? 'Cancel' : '✏️ Edit Features'}
                                        </button>
                                    </div>
                                </div>

                                {/* Feature grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-2)' }}>
                                    {features.map(f => {
                                        const enabled = org.features?.includes(f.key)
                                        return (
                                            <div key={f.key}
                                                onClick={isEditing ? () => toggleOrgFeature(org.id, f.key, org.features || []) : undefined}
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

                                {/* Footer */}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)',
                                    borderTop: '1px solid var(--border-subtle)'
                                }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        Login: <code style={{ color: 'var(--accent-cyan)' }}>consonant.synveritas.app/{org.slug}/login</code>
                                        {' · '}Created {new Date(org.created_at).toLocaleDateString('en-IN')}
                                    </span>
                                    <button className="btn btn-secondary" onClick={() => deleteOrg(org.id, org.name)}
                                        style={{ padding: '4px 12px', fontSize: '0.7rem', color: 'var(--accent-red)' }}>
                                        Delete Organization
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {orgs.length === 0 && !showForm && (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🏢</div>
                        <h3>No Organizations Yet</h3>
                        <p style={{ color: 'var(--text-muted)', margin: 'var(--space-2) auto var(--space-6)', maxWidth: '400px' }}>
                            Create an organization to get started. Each org gets its own slug, login URL, license, and feature set.
                        </p>
                        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Create First Organization</button>
                    </div>
                )}
            </div>
        </div>
    )
}
