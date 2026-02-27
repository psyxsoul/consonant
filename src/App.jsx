import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import AdminAuth from './pages/AdminAuth'
import AdminPanel from './pages/AdminPanel'
import DashboardLayout from './pages/DashboardLayout'
import Dashboard from './pages/Dashboard'
import ConsentManager from './pages/ConsentManager'
import DataMap from './pages/DataMap'
import Discovery from './pages/Discovery'
import DSRManager from './pages/DSRManager'
import Guardrails from './pages/Guardrails'
import AuditLog from './pages/AuditLog'
import DataSources from './pages/DataSources'
import CoPilot from './pages/CoPilot'
import LLMFirewall from './pages/LLMFirewall'
import LicenseManager from './pages/LicenseManager'

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()
    const { slug } = useParams()
    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading...</div>
    return isAuthenticated ? children : <Navigate to={slug ? `/${slug}/login` : '/auth'} replace />
}

function AdminRoute({ children }) {
    const { isAuthenticated, user, loading } = useAuth()
    if (loading) return null
    return (isAuthenticated && (user?.role === 'admin' || user?.role === 'owner' || user?.role === 'super_admin')) ? children : <Navigate to="." replace />
}

function SuperAdminRoute({ children }) {
    const { isAuthenticated, user, loading } = useAuth()
    if (loading) return null
    return (isAuthenticated && user?.role === 'super_admin') ? children : <Navigate to="/admin/login" replace />
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />

            {/* Super Admin Portal */}
            <Route path="/admin/login" element={<AdminAuth />} />
            <Route path="/admin" element={<SuperAdminRoute><AdminPanel /></SuperAdminRoute>}>
                <Route index element={<LicenseManager />} />
            </Route>

            {/* Slug-based tenant login */}
            <Route path="/:slug/login" element={<Auth />} />

            {/* Slug-based tenant dashboard */}
            <Route path="/:slug/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="consent" element={<ConsentManager />} />
                <Route path="datamap" element={<DataMap />} />
                <Route path="discovery" element={<Discovery />} />
                <Route path="dsr" element={<DSRManager />} />
                <Route path="guardrails" element={<Guardrails />} />
                <Route path="audit" element={<AdminRoute><AuditLog /></AdminRoute>} />
                <Route path="connectors" element={<AdminRoute><DataSources /></AdminRoute>} />
                <Route path="copilot" element={<CoPilot />} />
                <Route path="firewall" element={<LLMFirewall />} />
            </Route>

            {/* Legacy non-slug routes (backwards compat) */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="consent" element={<ConsentManager />} />
                <Route path="datamap" element={<DataMap />} />
                <Route path="discovery" element={<Discovery />} />
                <Route path="dsr" element={<DSRManager />} />
                <Route path="guardrails" element={<Guardrails />} />
                <Route path="audit" element={<AdminRoute><AuditLog /></AdminRoute>} />
                <Route path="connectors" element={<AdminRoute><DataSources /></AdminRoute>} />
                <Route path="copilot" element={<CoPilot />} />
                <Route path="firewall" element={<LLMFirewall />} />
            </Route>
        </Routes>
    )
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <div className="page-wrapper">
                    <div className="spatial-bg" />
                    <div className="glow-orb glow-cyan" style={{ width: '500px', height: '500px', top: '5%', right: '10%' }} />
                    <div className="glow-orb glow-violet" style={{ width: '400px', height: '400px', bottom: '10%', left: '5%' }} />
                    <AppRoutes />
                </div>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
