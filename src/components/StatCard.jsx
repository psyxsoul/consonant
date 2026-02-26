export default function StatCard({ icon, iconBg, value, label, trend, trendDir }) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <div className="stat-card-icon" style={{ background: iconBg }}>
                    {icon}
                </div>
                {trend && (
                    <span className={`stat-card-trend ${trendDir}`}>
                        {trendDir === 'up' ? '↑' : '↓'} {trend}
                    </span>
                )}
            </div>
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
        </div>
    )
}
