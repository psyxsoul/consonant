import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminAuth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login, isAuthenticated, user } = useAuth()
    const navigate = useNavigate()

    // Already logged in as super_admin → go to admin panel
    if (isAuthenticated && user?.role === 'super_admin') {
        navigate('/admin', { replace: true })
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            const data = await login(email, password)
            if (data.user.role !== 'super_admin') {
                setError('Access denied. Super admin credentials required.')
                setLoading(false)
                return
            }
            navigate('/admin', { replace: true })
        } catch (err) {
            setError(err.message || 'Login failed')
        } finally { setLoading(false) }
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-primary)', position: 'relative'
        }}>
            <div style={{
                width: '100%', maxWidth: '420px', padding: 'var(--space-8)',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)', position: 'relative'
            }}>
                {/* Admin header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg, var(--accent-red), var(--accent-violet))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', margin: '0 auto var(--space-4)', fontWeight: 800
                    }}>◈</div>
                    <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                        Consonant Admin
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        License & Organization Management
                    </p>
                </div>

                {error && (
                    <div style={{
                        padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)',
                        borderRadius: 'var(--radius-md)', background: 'var(--accent-red-dim)',
                        color: 'var(--accent-red)', fontSize: '0.8rem', fontWeight: 600
                    }}>
                        🚫 {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                        <label className="form-label">Admin Email</label>
                        <input className="form-input" type="email" value={email}
                            onChange={e => setEmail(e.target.value)} placeholder="admin@synveritas.app" required />
                    </div>
                    <div className="form-group mb-6">
                        <label className="form-label">Password</label>
                        <input className="form-input" type="password" value={password}
                            onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    <button className="btn btn-primary" type="submit" disabled={loading}
                        style={{
                            width: '100%', padding: 'var(--space-3)',
                            background: 'linear-gradient(135deg, var(--accent-red), var(--accent-violet))'
                        }}>
                        {loading ? 'Authenticating...' : '🔑 Sign in to Admin Portal'}
                    </button>
                </form>

                <div style={{
                    textAlign: 'center', marginTop: 'var(--space-6)',
                    fontSize: '0.7rem', color: 'var(--text-muted)'
                }}>
                    <span style={{
                        padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                        background: 'var(--accent-red-dim)', color: 'var(--accent-red)',
                        fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>Restricted Access</span>
                    <span style={{ marginLeft: 'var(--space-2)' }}>Super admin credentials only</span>
                </div>
            </div>
        </div>
    )
}
