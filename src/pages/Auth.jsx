import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import api from '../services/api'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [organization, setOrganization] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [orgInfo, setOrgInfo] = useState(null)
    const [slugError, setSlugError] = useState(null)
    const { login, loginWithGoogle, register } = useAuth()
    const navigate = useNavigate()
    const googleBtnRef = useRef(null)
    const { slug } = useParams()

    // Validate org slug
    useEffect(() => {
        if (slug) {
            api.validateSlug(slug)
                .then(org => setOrgInfo(org))
                .catch(() => setSlugError(`Organization "${slug}" not found`))
        }
    }, [slug])

    // Initialize Google Sign-In
    useEffect(() => {
        const initGoogle = () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder.apps.googleusercontent.com',
                    callback: handleGoogleCallback,
                })
                if (googleBtnRef.current) {
                    window.google.accounts.id.renderButton(googleBtnRef.current, {
                        theme: 'filled_black',
                        size: 'large',
                        width: '100%',
                        text: 'signin_with',
                        shape: 'rectangular',
                        logo_alignment: 'center',
                    })
                }
            }
        }

        // Wait for Google script to load
        if (window.google?.accounts?.id) {
            initGoogle()
        } else {
            const interval = setInterval(() => {
                if (window.google?.accounts?.id) {
                    clearInterval(interval)
                    initGoogle()
                }
            }, 200)
            return () => clearInterval(interval)
        }
    }, [isLogin])

    const handleGoogleCallback = async (response) => {
        setError('')
        setLoading(true)
        try {
            await loginWithGoogle(response.credential)
            navigate(slug ? `/${slug}/dashboard` : '/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

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
            navigate(slug ? `/${slug}/dashboard` : '/dashboard')
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
                            { icon: '🔐', text: 'Enterprise RBAC & Audit Trail' },
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

                    {/* Google Sign-In Button */}
                    <div ref={googleBtnRef} style={{ width: '100%', marginBottom: 'var(--space-4)', minHeight: '44px' }} />

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                        marginBottom: 'var(--space-4)', color: 'var(--text-muted)', fontSize: '0.8rem'
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
                        <span>or continue with email</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
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
