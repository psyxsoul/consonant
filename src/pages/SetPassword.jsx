import { useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function SetPassword() {
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { slug } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password.length < 6) return setError('Password must be at least 6 characters')
        if (password !== confirm) return setError('Passwords do not match')

        setLoading(true)
        try {
            await api.setPassword(token, password)
            setSuccess(true)
            setTimeout(() => navigate(`/${slug}/login`, { replace: true }), 3000)
        } catch (err) {
            setError(err.message || 'Failed to set password')
        } finally { setLoading(false) }
    }

    if (!token) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card" style={{ maxWidth: '400px', textAlign: 'center', padding: 'var(--space-8)' }}>
                    <h2>❌ Invalid Link</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>This invite link is missing a token. Please check your email and try again.</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-primary)'
        }}>
            <div style={{
                width: '100%', maxWidth: '420px', padding: 'var(--space-8)',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', margin: '0 auto var(--space-4)', fontWeight: 800, color: 'white'
                    }}>◈</div>
                    <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                        Set Your Password
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Create a password for your <strong style={{ color: 'var(--accent-cyan)' }}>{slug}</strong> account
                    </p>
                </div>

                {success ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✅</div>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-2)' }}>Password Set!</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 'var(--space-4)' }}>
                            Redirecting you to the login page...
                        </p>
                        <Link to={`/${slug}/login`} className="btn btn-primary" style={{ display: 'inline-block' }}>
                            Go to Login →
                        </Link>
                    </div>
                ) : (
                    <>
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
                                <label className="form-label">New Password</label>
                                <input className="form-input" type="password" value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="At least 6 characters" required minLength={6} />
                            </div>
                            <div className="form-group mb-6">
                                <label className="form-label">Confirm Password</label>
                                <input className="form-input" type="password" value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    placeholder="Re-enter password" required />
                            </div>
                            <button className="btn btn-primary" type="submit" disabled={loading}
                                style={{ width: '100%', padding: 'var(--space-3)' }}>
                                {loading ? 'Setting password...' : '🔑 Set Password & Continue'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
