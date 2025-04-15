import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PixelButton from '../UI/PixelButton'
import PixelInput from '../UI/PixelInput'

function Login() {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login, error } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const success = await login(identifier, password)
        setIsLoading(false)
        if (success) {
            navigate('/dashboard')
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-black">
                <h2 className="text-2xl font-bold mb-6 text-center text-green-800 pixel-shadow">Login to Habit Garden</h2>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Username or Email</label>
                        <PixelInput
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                            placeholder="Enter username or email"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Password</label>
                        <PixelInput 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter password"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <PixelButton type="submit" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </PixelButton>

                        <Link to="/register" className="text-green-600 hover:text-green-800 font-bold underline-pixel">
                            Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login