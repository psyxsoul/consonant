export default function PillarCard({ icon, color, title, description }) {
    return (
        <div className="pillar-card">
            <div className={`pillar-icon ${color}`}>
                {icon}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    )
}
