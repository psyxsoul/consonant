import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="navbar-logo" style={{ marginBottom: '8px' }}>
                            <span className="navbar-logo-icon">◈</span>
                            Consonant
                        </Link>
                        <p>
                            Next-generation Privacy-as-a-Service platform. Detect, Map, and Protect personal data with AI-powered intelligence.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Platform</h4>
                        <a href="#features">Semantic Discovery</a>
                        <a href="#features">Data Mapping</a>
                        <a href="#features">Consent Engine</a>
                        <a href="#features">DSR Management</a>
                        <a href="#features">Active Guardrails</a>
                    </div>

                    <div className="footer-col">
                        <h4>Compliance</h4>
                        <a href="#dpdpa">DPDPA 2023</a>
                        <a href="#">GDPR</a>
                        <a href="#">CCPA</a>
                        <a href="#">ISO 27701</a>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <a href="#">About</a>
                        <a href="#">Blog</a>
                        <a href="#">Careers</a>
                        <a href="#">Contact</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Consonant. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Privacy Policy</a>
                        <a href="#" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
