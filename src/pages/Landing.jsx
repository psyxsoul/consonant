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
        <div style={{ background: 'transparent' }}>
            <Navbar />

            {/* ===== HERO ===== */}
            <section className="hero animate-fade-in" style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                padding: 'var(--space-20) 0'
            }}>
                <div className="hero-grid-bg" style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(var(--border-default) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.2,
                    maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 0%, transparent 80%)'
                }} />

                <div className="hero-content container" style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: '1000px',
                    padding: '0 var(--space-6)'
                }}>
                    <h1 className="mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1 }}>
                        <span className="text-gradient">Detect. Map. Protect.</span>
                        <br />
                        Your Data, Intelligently.
                    </h1>

                    <p className="mb-10" style={{
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        color: 'var(--text-secondary)',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Consonant goes beyond passive compliance. Our AI-powered platform discovers sensitive data,
                        maps every processing activity, and actively defends your privacy posture — with native
                        DPDPA 2023 support.
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link to="/auth" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                            Launch Dashboard →
                        </Link>
                        <a href="#features" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                            Explore Features
                        </a>
                    </div>

                    <div className="glass-card flex items-center justify-center gap-8 mt-8" style={{ padding: 'var(--space-8)' }}>
                        <div className="text-center">
                            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="text-gradient">100+</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Connectors</div>
                        </div>
                        <div style={{ borderLeft: '1px solid var(--border-subtle)', height: '60px' }} />
                        <div className="text-center">
                            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="text-gradient">50ms</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Scan Speed</div>
                        </div>
                        <div style={{ borderLeft: '1px solid var(--border-subtle)', height: '60px' }} />
                        <div className="text-center">
                            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} className="text-gradient">99.7%</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Accuracy</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PILLARS ===== */}
            <section id="features" className="section-highlight animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="container">
                    <div className="text-center mb-12">
                        <span className="badge badge-cyan mb-4">Our Intelligence</span>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>The Five Pillars of Protection</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>Most platforms merely detect and report. Consonant detects, maps, and actively protects — powered by Gemini AI.</p>
                    </div>

                    <div className="grid-3 pillars-container">
                        {pillars.map((p, i) => (
                            <PillarCard key={i} index={i} {...p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== DPDPA ===== */}
            <section id="dpdpa" className="animate-fade-in" style={{ padding: 'var(--space-16) 0', position: 'relative' }}>
                <div className="container">
                    <div className="split-grid">
                        <div>
                            <span className="badge badge-violet mb-4">India-First Compliance</span>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-6)' }}>Native DPDPA 2023 Intelligence</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', lineHeight: 1.7 }}>
                                Purpose-built for the Indian Digital Personal Data Protection Act.
                                Understand your obligations as a Data Fiduciary or Processor with domain-specific guidance.
                            </p>

                            <div className="flex-col gap-6">
                                {[
                                    { icon: '⚖️', title: 'Legal Basis Validation', desc: 'Automatically evaluate whether processing has a lawful basis under the DPDPA.' },
                                    { icon: '🔔', title: 'Breach Notification Engine', desc: 'Generate compliant breach notifications within the mandated timelines.' },
                                    { icon: '👶', title: 'Children\'s Data Protection', desc: 'Detect and flag processing of children\'s data requiring guardian consent.' }
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div style={{
                                            width: '56px',
                                            height: '56px',
                                            background: 'var(--bg-glass)',
                                            borderRadius: 'var(--radius-md)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            border: '1px solid var(--border-default)',
                                            boxShadow: '0 4px 10px var(--shadow-color)'
                                        }}>{f.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{f.title}</h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid-2">
                            {dpdpaCards.map((card, i) => (
                                <div key={i} className="glass-card flex-col items-center justify-center text-center gap-4 p-6 hover-glow">
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        background: card.bg,
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        border: '1px solid var(--border-subtle)'
                                    }}>{card.icon}</div>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>{card.title}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{card.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="section-highlight animate-fade-in" style={{ animationDelay: '0.2s', textAlign: 'center' }}>
                <div className="container">
                    <div className="text-center mb-12">
                        <span className="badge badge-green mb-4">Seamless Onboarding</span>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>Three Steps to Privacy Intelligence</h2>
                    </div>

                    <div className="grid-3 gap-12">
                        {[
                            { num: '1', title: 'Connect', desc: 'Plug in your databases, cloud storage, and SaaS tools through our 100+ integrations.' },
                            { num: '2', title: 'Discover', desc: 'Our AI semantically scans your entire data landscape to identify PII and linkability risks.' },
                            { num: '3', title: 'Protect', desc: 'Automated consent mapping, active guardrails, and one-click DSR fulfillment secure your data.' }
                        ].map((s, i) => (
                            <div key={i} className="flex-col items-center">
                                <div style={{
                                    width: '72px',
                                    height: '72px',
                                    background: 'var(--gradient-accent)',
                                    borderRadius: '50%',
                                    marginBottom: 'var(--space-6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.75rem',
                                    fontWeight: 800,
                                    color: 'white',
                                    boxShadow: '0 8px 30px rgba(0, 212, 255, 0.4)'
                                }}>{s.num}</div>
                                <h3 style={{ fontSize: '1.35rem', marginBottom: 'var(--space-3)' }}>{s.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section style={{ padding: 'var(--space-12) 0 var(--space-20) 0' }}>
                <div className="container">
                    <div className="glass-card" style={{
                        background: 'var(--gradient-card)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-16) var(--space-8)',
                        textAlign: 'center',
                        border: '1px solid var(--border-accent)'
                    }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>Ready to <span className="text-gradient">Transform</span> Your Privacy?</h2>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-10)', maxWidth: '650px', margin: '0 auto var(--space-10)' }}>
                            Join the next generation of privacy-conscious organizations. Start detecting, mapping, and protecting in minutes.
                        </p>
                        <div className="flex justify-center gap-6 flex-wrap">
                            <Link to="/auth" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1.1rem' }}>
                                Start Free Trial →
                            </Link>
                            <button className="btn btn-secondary" style={{ padding: '16px 48px', fontSize: '1.1rem' }}>
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
