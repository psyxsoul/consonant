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

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()
    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading...</div>
    return isAuthenticated ? children : <Navigate to="/auth" replace />
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
            </Route>
        </Routes>
    )
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <div className="spatial-bg" />
                <div className="glow-orb glow-cyan" style={{ width: '600px', height: '600px', top: '-10%', right: '-5%' }} />
                <div className="glow-orb glow-violet" style={{ width: '500px', height: '500px', bottom: '-10%', left: '-5%' }} />
                <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <AppRoutes />
                </div>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
