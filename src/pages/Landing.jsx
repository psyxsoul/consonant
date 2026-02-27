import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PillarCard from '../components/PillarCard'

const pillars = [
    { icon: '🧠', color: 'cyan', title: 'Semantic Discovery', description: 'AI-powered detection that understands data intent, not just patterns. Identifies linkability risks and hidden PII across your entire stack.' },
    { icon: '🗺️', color: 'violet', title: 'Automated Data Mapping', description: 'Generate a living Record of Processing Activities. See exactly where data enters, flows, and is stored — in real-time.' },
    { icon: '✅', color: 'green', title: 'Consent Orchestration', description: 'Every data asset linked to a verifiable consent record. Instant flagging of processing without a clear legal basis.' },
    { icon: '📋', color: 'amber', title: 'DSR Management', description: 'Automated fulfillment for data access, erasure, and portability requests. Trace data across silos and design the exact path for action.' },
    { icon: '🛡️', color: 'red', title: 'Active Guardrails', description: 'Propose active defense plans: data masking, tokenization, and privacy vaults. Act as an AI proxy to redact sensitive data from prompts.' }
]

const dpdpaCards = [
    { icon: '🏛️', bg: 'var(--accent-cyan-dim)', title: 'Data Fiduciary Assessment', desc: 'Evaluate your role and obligations under the DPDPA framework.' },
    { icon: '📜', bg: 'var(--accent-violet-dim)', title: 'Consent Notice Builder', desc: 'Generate clear, specific, and informed consent notices per Indian law.' },
    { icon: '🤝', bg: 'var(--accent-green-dim)', title: 'Consent Manager Integration', desc: 'Interface with registered Consent Managers in the national framework.' },
    { icon: '🇮🇳', bg: 'var(--accent-amber-dim)', title: 'Cross-border Transfer Check', desc: 'Validate data transfer compliance with DPDPA localization requirements.' },
]

export default function Landing() {
    return (
        <>
            <Navbar />

            {/* ===== HERO ===== */}
            <section className="hero-section">
                <div className="hero-grid-bg" />
                <div className="hero-inner animate-fade-in">
                    <h1>
                        <span className="text-gradient">Detect. Map. Protect.</span>
                        <br />
                        Your Data, Intelligently.
                    </h1>
                    <p className="hero-sub">
                        Consonant goes beyond passive compliance. Our AI-powered platform discovers sensitive data, maps every processing activity, and actively defends your privacy posture — with native DPDPA 2023 support.
                    </p>
                    <div className="hero-actions">
                        <Link to="/auth" className="btn btn-primary">Launch Dashboard →</Link>
                        <a href="#features" className="btn btn-secondary">Explore Features</a>
                    </div>
                    <div className="glass-card hero-stats">
                        <div className="text-center">
                            <div className="hero-stat-value text-gradient">100+</div>
                            <div className="hero-stat-label">Connectors</div>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="text-center">
                            <div className="hero-stat-value text-gradient">50ms</div>
                            <div className="hero-stat-label">Scan Speed</div>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="text-center">
                            <div className="hero-stat-value text-gradient">99.7%</div>
                            <div className="hero-stat-label">Accuracy</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PILLARS ===== */}
            <section id="features" className="landing-section">
                <div className="container">
                    <div className="section-header">
                        <span className="badge badge-cyan mb-4">Our Intelligence</span>
                        <h2>The Five Pillars of Protection</h2>
                        <p>Most platforms merely detect and report. Consonant detects, maps, and actively protects — powered by Gemini AI.</p>
                    </div>
                    <div className="pillars-grid">
                        {pillars.map((p, i) => (
                            <PillarCard key={i} index={i} {...p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== DPDPA ===== */}
            <section id="dpdpa" className="landing-section">
                <div className="container">
                    <div className="split-layout">
                        <div>
                            <span className="badge badge-violet mb-4">India-First Compliance</span>
                            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: 'var(--space-6)' }}>
                                Native DPDPA 2023 Intelligence
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', lineHeight: 1.7 }}>
                                Purpose-built for the Indian Digital Personal Data Protection Act.
                                Understand your obligations as a Data Fiduciary or Processor with domain-specific guidance.
                            </p>
                            <div className="dpdpa-feature-list">
                                {[
                                    { icon: '⚖️', title: 'Legal Basis Validation', desc: 'Automatically evaluate whether processing has a lawful basis under the DPDPA.' },
                                    { icon: '🔔', title: 'Breach Notification Engine', desc: 'Generate compliant breach notifications within the mandated timelines.' },
                                    { icon: '👶', title: 'Children\'s Data Protection', desc: 'Detect and flag processing of children\'s data requiring guardian consent.' }
                                ].map((f, i) => (
                                    <div key={i} className="dpdpa-feature">
                                        <div className="dpdpa-feature-icon">{f.icon}</div>
                                        <div>
                                            <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{f.title}</h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="dpdpa-cards">
                            {dpdpaCards.map((card, i) => (
                                <div key={i} className="glass-card dpdpa-card">
                                    <div className="dpdpa-card-icon" style={{ background: card.bg }}>{card.icon}</div>
                                    <h4>{card.title}</h4>
                                    <p>{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section id="how-it-works" className="landing-section">
                <div className="container">
                    <div className="section-header">
                        <span className="badge badge-green mb-4">Seamless Onboarding</span>
                        <h2>Three Steps to Privacy Intelligence</h2>
                    </div>
                    <div className="steps-grid">
                        {[
                            { num: '1', title: 'Connect', desc: 'Plug in your databases, cloud storage, and SaaS tools through our 100+ integrations.' },
                            { num: '2', title: 'Discover', desc: 'Our AI semantically scans your entire data landscape to identify PII and linkability risks.' },
                            { num: '3', title: 'Protect', desc: 'Automated consent mapping, active guardrails, and one-click DSR fulfillment secure your data.' }
                        ].map((s, i) => (
                            <div key={i} className="step-card animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                                <div className="step-number">{s.num}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section className="landing-section">
                <div className="container">
                    <div className="glass-card cta-card">
                        <h2>Ready to <span className="text-gradient">Transform</span> Your Privacy?</h2>
                        <p>
                            Join the next generation of privacy-conscious organizations. Start detecting, mapping, and protecting in minutes.
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <Link to="/auth" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.05rem' }}>
                                Start Free Trial →
                            </Link>
                            <button className="btn btn-secondary" style={{ padding: '16px 40px', fontSize: '1.05rem' }}>
                                Schedule Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}
