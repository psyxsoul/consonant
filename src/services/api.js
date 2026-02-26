const API_BASE = '/api'

function getHeaders() {
    const headers = { 'Content-Type': 'application/json' }
    const token = localStorage.getItem('consonant_token')
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
}

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`
    const config = {
        headers: getHeaders(),
        ...options,
    }

    const res = await fetch(url, config)
    const data = await res.json().catch(() => null)

    if (!res.ok) {
        throw new Error(data?.error || `Request failed: ${res.status}`)
    }
    return data
}

const api = {
    // Auth
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name, email, password, organization) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, organization }) }),
    getMe: () => request('/auth/me'),

    // Dashboard
    getDashboardStats: () => request('/dashboard/stats'),
    getActivity: () => request('/dashboard/activity'),

    // Consent
    getConsent: () => request('/consent'),
    getConsentStats: () => request('/consent/stats'),
    createConsent: (data) => request('/consent', { method: 'POST', body: JSON.stringify(data) }),
    updateConsent: (id, data) => request(`/consent/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteConsent: (id) => request(`/consent/${id}`, { method: 'DELETE' }),

    // Data Map
    getDataMap: () => request('/datamap'),
    getDataFlow: () => request('/datamap/flow'),
    getDataMapStats: () => request('/datamap/stats'),
    createDataMap: (data) => request('/datamap', { method: 'POST', body: JSON.stringify(data) }),
    updateDataMap: (id, data) => request(`/datamap/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteDataMap: (id) => request(`/datamap/${id}`, { method: 'DELETE' }),

    // Discovery
    getDiscoveryResults: () => request('/discovery/results'),
    getDiscoveryStats: () => request('/discovery/stats'),
    runScan: (data) => request('/discovery/scan', { method: 'POST', body: JSON.stringify(data) }),

    // DSR
    getDSR: () => request('/dsr'),
    getDSRStats: () => request('/dsr/stats'),
    createDSR: (data) => request('/dsr', { method: 'POST', body: JSON.stringify(data) }),
    updateDSR: (id, data) => request(`/dsr/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteDSR: (id) => request(`/dsr/${id}`, { method: 'DELETE' }),

    // Guardrails
    getGuardrails: () => request('/guardrails'),
    getGuardrailStats: () => request('/guardrails/stats'),
    toggleGuardrail: (id) => request(`/guardrails/${id}/toggle`, { method: 'PUT' }),
    getProxyLog: () => request('/guardrails/proxy-log'),
    getVaults: () => request('/guardrails/vaults'),

    // AI
    analyze: (text, context) => request('/ai/analyze', { method: 'POST', body: JSON.stringify({ text, context }) }),
    generateConsentNotice: (data) => request('/ai/consent-notice', { method: 'POST', body: JSON.stringify(data) }),
    riskAssessment: (data) => request('/ai/risk-assessment', { method: 'POST', body: JSON.stringify(data) }),

    // Health
    health: () => request('/health'),
}

export default api
