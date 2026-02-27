export default function StatCard({ icon, value, label, trend, color }) {
    const isPositive = trend && (trend.startsWith('+') || trend.startsWith('-'))
    const trendUp = trend && trend.startsWith('+')

    return (
        <div className="kpi-card">
            <div className="kpi-top">
                <span className="kpi-label">{label}</span>
                {trend && (
                    <span className={`kpi-trend ${trendUp ? 'up' : 'down'}`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </span>
                )}
            </div>
            <div className="kpi-value" style={color ? { color } : undefined}>{value}</div>
            <div className="kpi-icon">{icon}</div>
        </div>
    )
}
