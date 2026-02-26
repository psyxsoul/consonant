import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PillarCard from '../components/PillarCard'

const pillars = [
    {
        icon: '🧠',
        color: 'cyan',
        title: 'Semantic Discovery',
        description: 'AI-powered detection that understands data intent, not just patterns. Identifies linkability risks and hidden PII across your entire stack.'
    },
    {
        icon: '🗺️',
        color: 'violet',
        title: 'Automated Data Mapping',
        description: 'Generate a living Record of Processing Activities. See exactly where data enters, flows, and is stored — in real-time.'
    },
    {
        icon: '✅',
        color: 'green',
        title: 'Consent Orchestration',
        description: 'Every data asset linked to a verifiable consent record. Instant flagging of processing without a clear legal basis.'
    },
    {
        icon: '📋',
        color: 'amber',
        title: 'DSR Management',
        description: 'Automated fulfillment for data access, erasure, and portability requests. Trace data across silos and design the exact path for action.'
    },
    {
        icon: '🛡️',
        color: 'red',
        title: 'Active Guardrails',
        description: 'Propose active defense plans: data masking, tokenization, and privacy vaults. Act as an AI proxy to redact sensitive data from prompts.'
    }
]

const dpdpaCards = [
    { icon: '🏛️', bg: 'var(--accent-cyan-dim)', title: 'Data Fiduciary Assessment', desc: 'Evaluate your role and obligations under the DPDPA framework.' },
    { icon: '📜', bg: 'var(--accent-violet-dim)', title: 'Consent Notice Builder', desc: 'Generate clear, specific, and informed consent notices per Indian law.' },
    { icon: '🤝', bg: 'var(--accent-green-dim)', title: 'Consent Manager Integration', desc: 'Interface with registered Consent Managers in the national framework.' },
    { icon: '🇮🇳', bg: 'var(--accent-amber-dim)', title: 'Cross-border Transfer Check', desc: 'Validate data transfer compliance with DPDPA localization requirements.' },
]

export default function Landing() {
    return (
        <div>
            <Navbar />

            {/* ===== HERO ===== */}
            <section className="hero">
                <div className="hero-grid-bg" />
                <div className="hero-glow-1" />
                <div className="hero-glow-2" />

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="dot" />
                        Privacy-as-a-Service Platform
                    </div>

                    <h1>
                        <span className="text-gradient">Detect. Map. Protect.</span>
                        <br />
                        Your Data, Intelligently.
                    </h1>

                    <p className="hero-subtitle">
                        Consonant goes beyond passive compliance. Our AI-powered platform discovers sensitive data,
                        maps every processing activity, and actively defends your privacy posture — with native
                        DPDPA 2023 support.
                    </p>

                    <div className="hero-actions">
                        <Link to="/dashboard" className="btn btn-primary">
                            Launch Dashboard →
                        </Link>
                        <a href="#features" className="btn btn-secondary">
                            Explore Features
                        </a>
                    </div>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-value text-gradient">100+</div>
                            <div className="hero-stat-label">Data Connectors</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value text-gradient">50ms</div>
                            <div className="hero-stat-label">Avg. Detection Time</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value text-gradient">99.7%</div>
                            <div className="hero-stat-label">Accuracy Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PILLARS ===== */}
            <section className="pillars-section" id="features">
                <div className="container">
                    <div className="pillars-header">
                        <span className="section-label">The Five Pillars</span>
                        <h2>Intelligence That <span className="text-gradient">Goes Beyond</span> Detection</h2>
                        <p>Most platforms merely detect and report. Consonant detects, maps, and actively protects — powered by high-reasoning AI.</p>
                    </div>

                    <div className="pillars-grid">
                        {pillars.map((p, i) => (
                            <PillarCard key={i} {...p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== DPDPA ===== */}
            <section className="dpdpa-section" id="dpdpa">
                <div className="container">
                    <div className="dpdpa-grid">
                        <div className="dpdpa-content">
                            <span className="section-label" style={{
                                display: 'inline-block', fontSize: '0.75rem', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.12em',
                                color: 'var(--accent-cyan)', marginBottom: 'var(--space-4)'
                            }}>
                                India-First Compliance
                            </span>
                            <h2>Native <span className="text-gradient">DPDPA 2023</span> Intelligence</h2>
                            <p style={{ marginBottom: 'var(--space-8)' }}>
                                Purpose-built for the Indian Digital Personal Data Protection Act.
                                Understand your obligations as a Data Fiduciary or Processor with domain-specific guidance.
                            </p>

                            <div className="dpdpa-features">
                                <div className="dpdpa-feature">
                                    <div className="dpdpa-feature-icon">⚖️</div>
                                    <div>
                                        <h4>Legal Basis Validation</h4>
                                        <p>Automatically evaluate whether processing has a lawful basis under the DPDPA.</p>
                                    </div>
                                </div>
                                <div className="dpdpa-feature">
                                    <div className="dpdpa-feature-icon">🔔</div>
                                    <div>
                                        <h4>Breach Notification Engine</h4>
                                        <p>Generate compliant breach notifications within the mandated timelines.</p>
                                    </div>
                                </div>
                                <div className="dpdpa-feature">
                                    <div className="dpdpa-feature-icon">👶</div>
                                    <div>
                                        <h4>Children's Data Protection</h4>
                                        <p>Detect and flag processing of children's data requiring verifiable guardian consent.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dpdpa-visual">
                            {dpdpaCards.map((card, i) => (
                                <div className="dpdpa-card" key={i}>
                                    <div className="dpdpa-card-icon" style={{ background: card.bg }}>
                                        {card.icon}
                                    </div>
                                    <div>
                                        <h4>{card.title}</h4>
                                        <p>{card.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="how-section" id="how-it-works">
                <div className="container">
                    <div className="how-header">
                        <span className="section-label">How It Works</span>
                        <h2>Three Steps to <span className="text-gradient">Privacy Intelligence</span></h2>
                    </div>

                    <div className="how-steps">
                        <div className="how-step">
                            <div className="how-step-num">1</div>
                            <h3>Connect</h3>
                            <p>Plug in your databases, cloud storage, and SaaS tools through our 100+ integrations.</p>
                        </div>
                        <div className="how-step">
                            <div className="how-step-num">2</div>
                            <h3>Discover</h3>
                            <p>Our AI semantically scans your entire data landscape to identify PII and linkability risks.</p>
                        </div>
                        <div className="how-step">
                            <div className="how-step-num">3</div>
                            <h3>Protect</h3>
                            <p>Automated consent mapping, active guardrails, and one-click DSR fulfillment secure your data.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-box">
                        <h2>Ready to <span className="text-gradient">Transform</span> Your Privacy Posture?</h2>
                        <p>Join the next generation of privacy-conscious organizations. Start detecting, mapping, and protecting in minutes.</p>
                        <div className="flex justify-center gap-4">
                            <Link to="/dashboard" className="btn btn-primary">
                                Start Free Trial →
                            </Link>
                            <button className="btn btn-secondary">
                                Schedule Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
