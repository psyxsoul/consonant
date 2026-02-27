import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import DashboardLayout from './pages/DashboardLayout'
import Dashboard from './pages/Dashboard'
import ConsentManager from './pages/ConsentManager'
import DataMap from './pages/DataMap'
import Discovery from './pages/Discovery'
import DSRManager from './pages/DSRManager'
import Guardrails from './pages/Guardrails'
import AuditLog from './pages/AuditLog'
import DataSources from './pages/DataSources'

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()
    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading...</div>
    return isAuthenticated ? children : <Navigate to="/auth" replace />
}

function AdminRoute({ children }) {
    const { isAdmin, loading } = useAuth()
    if (loading) return null
    return isAdmin ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="consent" element={<ConsentManager />} />
                <Route path="datamap" element={<DataMap />} />
                <Route path="discovery" element={<Discovery />} />
                <Route path="dsr" element={<DSRManager />} />
                <Route path="guardrails" element={<Guardrails />} />
                <Route path="audit" element={<AdminRoute><AuditLog /></AdminRoute>} />
                <Route path="connectors" element={<AdminRoute><DataSources /></AdminRoute>} />
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
