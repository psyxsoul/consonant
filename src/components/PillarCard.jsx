export default function PillarCard({ icon, color, title, description, index }) {
    return (
        <div
            className="pillar-card glass-card animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className={`pillar-icon icon-${color}`}>
                {icon}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    )
}
