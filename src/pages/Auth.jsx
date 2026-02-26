import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [organization, setOrganization] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login, register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            if (isLogin) {
                await login(email, password)
            } else {
                await register(name, email, password, organization)
            }
            navigate('/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="hero" style={{ minHeight: '100vh' }}>
            <div className="hero-grid-bg" />
            <div className="hero-glow-1" />
            <div className="hero-glow-2" />

            <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 440, padding: 'var(--space-6)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <div className="navbar-logo" style={{ justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                        <span className="navbar-logo-icon">◈</span>
                        Consonant
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Privacy-as-a-Service Platform</p>
                </div>

                <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
                    <div style={{ display: 'flex', marginBottom: 'var(--space-6)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                        <button
                            onClick={() => { setIsLogin(true); setError('') }}
                            style={{
                                flex: 1, padding: 'var(--space-3)', fontSize: '0.85rem', fontWeight: 600,
                                background: isLogin ? 'var(--accent-cyan-dim)' : 'transparent',
                                color: isLogin ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                border: 'none', cursor: 'pointer'
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError('') }}
                            style={{
                                flex: 1, padding: 'var(--space-3)', fontSize: '0.85rem', fontWeight: 600,
                                background: !isLogin ? 'var(--accent-cyan-dim)' : 'transparent',
                                color: !isLogin ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                border: 'none', cursor: 'pointer'
                            }}
                        >
                            Register
                        </button>
                    </div>

                    {error && (
                        <div style={{
                            padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)',
                            background: 'var(--accent-red-dim)', border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 'var(--radius-sm)', color: 'var(--accent-red)', fontSize: '0.85rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {!isLogin && (
                            <>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Full Name</label>
                                    <input
                                        type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                        placeholder="Enter your name"
                                        style={{
                                            width: '100%', padding: 'var(--space-3) var(--space-4)',
                                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)',
                                            borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                                            fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Organization</label>
                                    <input
                                        type="text" value={organization} onChange={(e) => setOrganization(e.target.value)}
                                        placeholder="Your company name"
                                        style={{
                                            width: '100%', padding: 'var(--space-3) var(--space-4)',
                                            background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)',
                                            borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                                            fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none'
                                        }}
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Email</label>
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                placeholder="you@company.com"
                                style={{
                                    width: '100%', padding: 'var(--space-3) var(--space-4)',
                                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                                    fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Password</label>
                            <input
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                placeholder="••••••••"
                                style={{
                                    width: '100%', padding: 'var(--space-3) var(--space-4)',
                                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)',
                                    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                                    fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none'
                                }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                            {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
