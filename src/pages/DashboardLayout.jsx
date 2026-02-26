import { Outlet, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            {/* Top Bar */}
            <header className="dash-topbar">
                <div className="dash-topbar-left">
                    <Link to="/" className="dash-topbar-logo">
                        <span className="logo-icon">◈</span>
                        Consonant
                    </Link>
                    <div className="dash-topbar-search">
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>🔍</span>
                        <input type="text" placeholder="Search data assets, policies..." />
                    </div>
                </div>

                <div className="dash-topbar-right">
                    <button className="topbar-icon-btn" title="Notifications">
                        🔔
                        <span className="notif-dot" />
                    </button>
                    <button className="topbar-icon-btn" title="Help">
                        ❓
                    </button>
                    <div className="topbar-avatar">ON</div>
                </div>
            </header>

            <Sidebar />

            <main className="dash-main">
                <Outlet />
            </main>
        </div>
    )
}
