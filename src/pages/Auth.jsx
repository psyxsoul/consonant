import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

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
        <div className="auth-page">
            {/* Left side — branding panel */}
            <div className="auth-brand">
                <div className="auth-brand-inner">
                    <Link to="/" className="navbar-logo" style={{ marginBottom: 'var(--space-8)' }}>
                        <span className="navbar-logo-icon">◈</span>
                        Consonant
                    </Link>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: 'var(--space-4)', lineHeight: 1.2 }}>
                        Privacy Intelligence,<br />
                        <span className="text-gradient">Simplified.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '380px' }}>
                        Detect sensitive data, map every processing activity, and actively defend your privacy posture — powered by Gemini AI.
                    </p>
                    <div className="auth-brand-features">
                        {[
                            { icon: '🧠', text: 'AI-Powered Discovery' },
                            { icon: '🗺️', text: 'Automated Data Mapping' },
                            { icon: '🛡️', text: 'Active Guardrails' },
                            { icon: '🇮🇳', text: 'Native DPDPA 2023' }
                        ].map((f, i) => (
                            <div key={i} className="auth-brand-feature">
                                <span>{f.icon}</span>
                                <span>{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side — form */}
            <div className="auth-form-side">
                <div className="auth-form-topbar">
                    <ThemeToggle />
                </div>
                <div className="auth-form-wrapper">
                    <div className="auth-form-header">
                        <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
                        <p>{isLogin ? 'Sign in to your Consonant dashboard' : 'Get started with Consonant in seconds'}</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${isLogin ? 'active' : ''}`}
                            onClick={() => { setIsLogin(true); setError('') }}
                        >
                            Sign In
                        </button>
                        <button
                            className={`auth-tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => { setIsLogin(false); setError('') }}
                        >
                            Register
                        </button>
                    </div>

                    {error && (
                        <div className="auth-error">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text" className="form-input" value={name}
                                        onChange={(e) => setName(e.target.value)} required
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Organization</label>
                                    <input
                                        type="text" className="form-input" value={organization}
                                        onChange={(e) => setOrganization(e.target.value)}
                                        placeholder="Your company name"
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email" className="form-input" value={email}
                                onChange={(e) => setEmail(e.target.value)} required
                                placeholder="you@company.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password" className="form-input" value={password}
                                onChange={(e) => setPassword(e.target.value)} required
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button className="auth-switch-link" onClick={() => { setIsLogin(!isLogin); setError('') }}>
                            {isLogin ? 'Create one' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
