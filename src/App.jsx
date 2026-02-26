import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import DashboardLayout from './pages/DashboardLayout'
import Dashboard from './pages/Dashboard'
import ConsentManager from './pages/ConsentManager'
import DataMap from './pages/DataMap'
import Discovery from './pages/Discovery'
import DSRManager from './pages/DSRManager'
import Guardrails from './pages/Guardrails'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
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

export default App
