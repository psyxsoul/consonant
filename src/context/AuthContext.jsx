import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('consonant_token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (token) {
            api.getMe()
                .then(u => setUser(u))
                .catch(() => {
                    localStorage.removeItem('consonant_token')
                    setToken(null)
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [token])

    const login = async (email, password) => {
        const data = await api.login(email, password)
        localStorage.setItem('consonant_token', data.token)
        setToken(data.token)
        setUser(data.user)
        return data
    }

    const register = async (name, email, password, organization) => {
        const data = await api.register(name, email, password, organization)
        localStorage.setItem('consonant_token', data.token)
        setToken(data.token)
        setUser(data.user)
        return data
    }

    const logout = () => {
        localStorage.removeItem('consonant_token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
