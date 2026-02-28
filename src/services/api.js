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
    googleAuth: (credential) => request('/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),
    getMe: () => request('/auth/me'),

    // Team Management
    getTeam: () => request('/auth/users'),
    updateUserRole: (id, role) => request(`/auth/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),

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
    toggleGuardrail: (id, payload) => request(`/guardrails/${id}/toggle`, { method: 'PUT', body: JSON.stringify(payload) }),
    getProxyLog: () => request('/guardrails/proxy-log'),
    getVaults: () => request('/guardrails/vaults'),

    // Slug validation & invite flow
    validateSlug: (slug) => request(`/auth/org/${slug}`),
    setPassword: (token, password) => request('/auth/set-password', { method: 'POST', body: JSON.stringify({ token, password }) }),

    // AI
    analyze: (text, context) => request('/ai/analyze', { method: 'POST', body: JSON.stringify({ text, context }) }),
    generateConsentNotice: (data) => request('/ai/consent-notice', { method: 'POST', body: JSON.stringify(data) }),
    riskAssessment: (data) => request('/ai/risk-assessment', { method: 'POST', body: JSON.stringify(data) }),

    // AI Superpowers
    copilot: (question, conversationHistory) => request('/ai/copilot', { method: 'POST', body: JSON.stringify({ question, conversationHistory }) }),
    firewall: (prompt, model) => request('/ai/firewall', { method: 'POST', body: JSON.stringify({ prompt, model }) }),
    dsrPlan: (dsr_id) => request('/ai/dsr-plan', { method: 'POST', body: JSON.stringify({ dsr_id }) }),
    complianceReport: (framework) => request('/ai/compliance-report', { method: 'POST', body: JSON.stringify({ framework }) }),

    // Data Source Connectors
    getDataSources: () => request('/connectors'),
    addDataSource: (data) => request('/connectors', { method: 'POST', body: JSON.stringify(data) }),
    testDataSource: (id) => request(`/connectors/${id}/test`, { method: 'POST' }),
    scanDataSource: (id) => request(`/connectors/${id}/scan`, { method: 'POST' }),
    deleteDataSource: (id) => request(`/connectors/${id}`, { method: 'DELETE' }),

    // Organizations
    getOrgs: () => request('/orgs'),
    createOrg: (data) => request('/orgs', { method: 'POST', body: JSON.stringify(data) }),
    updateOrg: (id, data) => request(`/orgs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteOrg: (id) => request(`/orgs/${id}`, { method: 'DELETE' }),
    getOrgUsers: (id) => request(`/orgs/${id}/users`),
    updateOrgFeatures: (id, features) => request(`/orgs/${id}/features`, { method: 'PUT', body: JSON.stringify({ features }) }),

    // Licenses & Features
    getLicenses: () => request('/licenses'),
    createLicense: (data) => request('/licenses', { method: 'POST', body: JSON.stringify(data) }),
    updateLicense: (id, data) => request(`/licenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteLicense: (id) => request(`/licenses/${id}`, { method: 'DELETE' }),
    updateLicenseFeatures: (id, features) => request(`/licenses/${id}/features`, { method: 'PUT', body: JSON.stringify({ features }) }),
    getFeatures: () => request('/licenses/features'),
    getPlanPresets: () => request('/licenses/plans'),
    getProxyLog: () => request('/ai/proxy-log').catch(() => []),

    // Audit Trail
    getAuditLog: (page = 1, limit = 50, filters = {}) => {
        const params = new URLSearchParams({ page, limit, ...filters })
        return request(`/audit?${params}`)
    },
    getAuditStats: () => request('/audit/stats'),
    exportAuditLog: () => `${API_BASE}/audit/export?token=${localStorage.getItem('consonant_token')}`,

    // Health
    health: () => request('/health'),
}

export default api
