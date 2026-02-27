export default function PillarCard({ icon, color, title, description, index }) {
    // Generate a subtle animation delay so they float in sequence
    const delay = `${index * 0.15}s`

    return (
        <div
            className="pillar-card glass-card animate-fade-in group"
            style={{
                animationDelay: delay,
                position: 'relative',
                transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                cursor: 'pointer'
            }}
        >
            <div className={`pillar-icon-wrapper color-${color}`}>
                <div className="icon-inner">{icon}</div>
                <div className="icon-glow" />
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-3)', transition: 'color 0.3s ease' }}>
                {title}
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, transition: 'color 0.3s ease' }}>
                {description}
            </p>

            {/* Subtle decorative border highlight on hover */}
            <div className="pillar-border-flash" />
        </div>
    )
}
