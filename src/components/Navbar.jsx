import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-inner">
                <Link to="/" className="navbar-logo">
                    <span className="navbar-logo-icon">◈</span>
                    Consonant
                </Link>

                <div className="navbar-links">
                    <a href="#features">Features</a>
                    <a href="#dpdpa">DPDPA</a>
                    <a href="#how-it-works">How It Works</a>
                    <Link to="/auth">Dashboard</Link>
                </div>

                <div className="navbar-actions">
                    <Link to="/auth" className="btn btn-primary">
                        Get Started →
                    </Link>
                </div>
            </div>
        </nav>
    )
}
