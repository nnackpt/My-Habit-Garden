import { Link } from "react-router-dom"
import { useAuth } from '../../context/AuthContext'
import PixelButton from '../UI/PixelButton'

function Navbar() {
    const { currentUser, logout } = useAuth()

    return (
        <nav className="bg-green-800 border-b-4 border-black">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center">
                        <div className="mr-2 w-8 h-8 flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-full h-full">
                                <rect x="2" y="28" width="32" height="6" fill="#8B5E3C" />
                                <rect x="12" y="8" width="4" height="20" fill="#33CC66" />
                                <circle cx="14" cy="6" r="4" fill="#FF66CC" />
                                <rect x="20" y="14" width="4" height="14" fill="#33CC66" />
                                <circle cx="22" cy="12" r="3" fill="#FF66CC" />
                            </svg>
                        </div>
                        <span className="text-white text-2xl font-bold pixel-shadow">Habit Garden</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <Link to="/dashboard" className="text-white hover:text-green-200 font-bold">
                                    Dashboard
                                </Link>
                                <Link to="/garden" className="text-white hover:text-green-200 font-bold" >
                                    Garden
                                </Link>
                                <PixelButton 
                                    onClick={logout}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Logout
                                </PixelButton>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <PixelButton>Login</PixelButton>
                                </Link>
                                <Link to="/register">
                                    <PixelButton className="bg-blue-600 hover:bg-blue-700">Register</PixelButton>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar