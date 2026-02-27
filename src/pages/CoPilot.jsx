import { useState, useRef, useEffect } from 'react'
import api from '../services/api'

const SUGGESTED_QUESTIONS = [
    "Am I compliant with DPDPA Section 8(3)?",
    "What are my top 3 privacy risks right now?",
    "Do I have proper consent for marketing communications?",
    "Which of my data processing activities are high risk?",
    "Are my guardrails sufficient for DPDPA compliance?",
    "Generate a compliance gap analysis for my organization",
    "What data do I hold that requires explicit consent?",
    "Compare my setup against GDPR requirements",
]

export default function CoPilot() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [reportLoading, setReportLoading] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (question) => {
        const q = question || input.trim()
        if (!q || loading) return

        const userMsg = { role: 'user', content: q }
        const updatedMessages = [...messages, userMsg]
        setMessages(updatedMessages)
        setInput('')
        setLoading(true)

        try {
            const data = await api.copilot(q, messages.slice(-10))
            setMessages([...updatedMessages, {
                role: 'assistant', content: data.response,
                context: data.context_used
            }])
        } catch (err) {
            setMessages([...updatedMessages, {
                role: 'assistant', content: `❌ Error: ${err.message}`, isError: true
            }])
        } finally { setLoading(false) }
    }

    const generateReport = async (framework) => {
        setReportLoading(true)
        try {
            const data = await api.complianceReport(framework)
            setMessages(prev => [...prev,
            { role: 'user', content: `Generate ${framework.toUpperCase()} compliance report` },
            { role: 'assistant', content: data.report, isReport: true }
            ])
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: `❌ ${err.message}`, isError: true }])
        } finally { setReportLoading(false) }
    }

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
            <div className="page-header mb-4">
                <div>
                    <h1>🧠 Vera</h1>
                    <p>Your AI privacy advisor — powered by live platform data + Gemini</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {['dpdpa', 'gdpr', 'ccpa'].map(fw => (
                        <button key={fw} className="btn btn-secondary" onClick={() => generateReport(fw)} disabled={reportLoading}
                            style={{ padding: '6px 14px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                            📄 {fw} Report
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4) 0' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🧠</div>
                        <h2 style={{ marginBottom: 'var(--space-2)', fontSize: '1.3rem' }}>Meet Vera</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto var(--space-8)', lineHeight: 1.6 }}>
                            I have access to your live consent records, data map, discovery findings, DSR queue, guardrails, and connected data sources. Ask me anything.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-3)', maxWidth: '700px', margin: '0 auto' }}>
                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                <button key={i} onClick={() => sendMessage(q)}
                                    className="btn btn-secondary" style={{
                                        padding: 'var(--space-3) var(--space-4)', fontSize: '0.8rem', textAlign: 'left',
                                        whiteSpace: 'normal', lineHeight: 1.4, minHeight: '52px'
                                    }}>
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: 'var(--space-4)', padding: '0 var(--space-2)'
                    }}>
                        <div style={{
                            maxWidth: '85%', padding: 'var(--space-4) var(--space-5)',
                            borderRadius: 'var(--radius-lg)',
                            background: msg.role === 'user' ? 'var(--accent-cyan-dim)' : msg.isError ? 'var(--accent-red-dim)' : 'var(--bg-secondary)',
                            border: `1px solid ${msg.role === 'user' ? 'var(--accent-cyan)' : msg.isError ? 'var(--accent-red)' : 'var(--border-subtle)'}`,
                            fontSize: '0.85rem', lineHeight: 1.7
                        }}>
                            {msg.role === 'assistant' && (
                                <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {msg.isReport ? '📄 Compliance Report' : '🧠 Vera'}
                                </div>
                            )}
                            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                            {msg.context && (
                                <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', gap: 'var(--space-4)' }}>
                                    <span>📋 {msg.context.consent} consent records</span>
                                    <span>🗺️ {msg.context.dataMap} data maps</span>
                                    <span>🔍 {msg.context.findings} finding groups</span>
                                    <span>📨 {msg.context.dsr} DSR statuses</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '0 var(--space-2)' }}>
                        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                            <div className="spinner" style={{ width: '20px', height: '20px' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
                padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-primary)', display: 'flex', gap: 'var(--space-3)'
            }}>
                <input className="form-input" style={{ flex: 1, fontSize: '0.9rem' }}
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Ask Vera about your privacy posture, compliance gaps, or DPDPA requirements..."
                    disabled={loading} />
                <button className="btn btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()}
                    style={{ padding: '0 var(--space-6)' }}>
                    {loading ? '...' : 'Ask →'}
                </button>
            </div>
        </div>
    )
}
