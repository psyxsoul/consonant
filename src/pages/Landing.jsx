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
        <div style={{ background: 'var(--bg-primary)', transition: 'all var(--transition-base)' }}>
            <Navbar />

            {/* ===== HERO ===== */}
            <section className="hero" style={{
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

                <div className="hero-content" style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: '900px',
                    padding: '0 var(--space-6)'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: '10px 20px',
                        background: 'var(--bg-glass)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--accent-cyan)',
                        marginBottom: 'var(--space-6)',
                        boxShadow: '0 4px 15px var(--shadow-color)'
                    }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            background: 'var(--accent-green)',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px var(--accent-green)'
                        }} />
                        Privacy-as-a-Service Platform
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: 'var(--space-6)', lineHeight: 1.1 }}>
                        <span className="text-gradient">Detect. Map. Protect.</span>
                        <br />
                        Your Data, Intelligently.
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        color: 'var(--text-secondary)',
                        maxWidth: '700px',
                        margin: '0 auto var(--space-10)',
                        lineHeight: 1.6
                    }}>
                        Consonant goes beyond passive compliance. Our AI-powered platform discovers sensitive data,
                        maps every processing activity, and actively defends your privacy posture — with native
                        DPDPA 2023 support.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                        <Link to="/auth" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                            Launch Dashboard →
                        </Link>
                        <a href="#features" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                            Explore Features
                        </a>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'clamp(var(--space-8), 5vw, var(--space-16))',
                        marginTop: 'var(--space-16)',
                        padding: 'var(--space-8)',
                        background: 'var(--bg-glass)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-default)',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gradient">100+</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Data Connectors</div>
                        </div>
                        <div style={{ borderLeft: '1px solid var(--border-default)' }} />
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gradient">50ms</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Detection Speed</div>
                        </div>
                        <div style={{ borderLeft: '1px solid var(--border-default)' }} />
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 800 }} className="text-gradient">99.7%</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Accuracy Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PILLARS ===== */}
            <section id="features" style={{ padding: 'var(--space-24) 0', position: 'relative' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
                        <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--accent-cyan)',
                            marginBottom: 'var(--space-3)',
                            display: 'block'
                        }}>Our Intelligence</span>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>The Five Pillars of Protection</h2>
                        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>Most platforms merely detect and report. Consonant detects, maps, and actively protects — powered by Gemini AI.</p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: 'var(--space-8)'
                    }}>
                        {pillars.map((p, i) => (
                            <PillarCard key={i} {...p} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== DPDPA ===== */}
            <section id="dpdpa" style={{
                padding: 'var(--space-24) 0',
                background: 'var(--bg-secondary)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: 'var(--space-16)',
                        alignItems: 'center'
                    }}>
                        <div>
                            <span style={{
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: 'var(--accent-violet)',
                                marginBottom: 'var(--space-3)',
                                display: 'block'
                            }}>India-First Compliance</span>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-6)' }}>Native DPDPA 2023 Intelligence</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', lineHeight: 1.7 }}>
                                Purpose-built for the Indian Digital Personal Data Protection Act.
                                Understand your obligations as a Data Fiduciary or Processor with domain-specific guidance.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                                {[
                                    { icon: '⚖️', title: 'Legal Basis Validation', desc: 'Automatically evaluate whether processing has a lawful basis under the DPDPA.' },
                                    { icon: '🔔', title: 'Breach Notification Engine', desc: 'Generate compliant breach notifications within the mandated timelines.' },
                                    { icon: '👶', title: 'Children\'s Data Protection', desc: 'Detect and flag processing of children\'s data requiring guardian consent.' }
                                ].map((f, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 'var(--space-4)' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            background: 'var(--bg-glass)',
                                            borderRadius: 'var(--radius-md)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem',
                                            border: '1px solid var(--border-default)'
                                        }}>{f.icon}</div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{f.title}</h4>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 'var(--space-4)'
                        }}>
                            {dpdpaCards.map((card, i) => (
                                <div key={i} className="glass-card" style={{
                                    padding: 'var(--space-6)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--space-4)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        background: card.bg,
                                        borderRadius: 'var(--radius-md)',
                                        margin: '0 auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}>{card.icon}</div>
                                    <div>
                                        <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{card.title}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{card.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section style={{ padding: 'var(--space-24) 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
                        <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--accent-green)',
                            marginBottom: 'var(--space-3)',
                            display: 'block'
                        }}>Seamless Onboarding</span>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>Three Steps to Privacy Intelligence</h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--space-12)',
                        textAlign: 'center'
                    }}>
                        {[
                            { num: '1', title: 'Connect', desc: 'Plug in your databases, cloud storage, and SaaS tools through our 100+ integrations.' },
                            { num: '2', title: 'Discover', desc: 'Our AI semantically scans your entire data landscape to identify PII and linkability risks.' },
                            { num: '3', title: 'Protect', desc: 'Automated consent mapping, active guardrails, and one-click DSR fulfillment secure your data.' }
                        ].map((s, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: 'var(--gradient-accent)',
                                    borderRadius: '50%',
                                    margin: '0 auto var(--space-6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    color: 'white',
                                    boxShadow: '0 8px 25px rgba(0, 212, 255, 0.3)'
                                }}>{s.num}</div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-3)' }}>{s.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA ===== */}
            <section style={{ padding: '0 0 var(--space-24) 0' }}>
                <div className="container">
                    <div style={{
                        background: 'var(--gradient-card)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-16)',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid var(--border-default)'
                    }}>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>Ready to <span className="text-gradient">Transform</span> Your Privacy?</h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-10)', maxWidth: '600px', margin: '0 auto var(--space-10)' }}>
                                Join the next generation of privacy-conscious organizations. Start detecting, mapping, and protecting in minutes.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                <Link to="/auth" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '1.1rem' }}>
                                    Start Free Trial →
                                </Link>
                                <button className="btn btn-secondary" style={{ padding: '14px 40px', fontSize: '1.1rem' }}>
                                    Schedule Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
