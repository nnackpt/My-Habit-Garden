import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            fetchUserInfo(token)
        } else {
            setLoading(false)
        }
    }, []);

    const fetchUserInfo = async (token) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCurrentUser(response.data)
        } catch (err) {
            console.error("Failed to fetch user info:", err)
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (identifier, password) => {
        try {
            setError('')
            const response = await axios.post('http://127.0.0.1:8000/login', {
                identifier,
                password
            })

            const { access_token } = response.data
            localStorage.setItem('token', access_token)
            await fetchUserInfo(access_token)
            return true
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to login')
            return false
        }
    }
    
    const register = async (userData) => {
        try {
            setError('')
            const formData = new FormData()
            for (const key in userData) {
                if (userData[key] !== null && userData[key] !== undefined) {
                    formData.append(key, userData[key])
                }
            }

            const response = await axios.post('http://127.0.0.1:8000/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            return true
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to register')
            return false
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setCurrentUser(null)
    }

    const value = {
        currentUser,
        login,
        register,
        logout,
        error
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}