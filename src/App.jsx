import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import GardenView from './components/Garden/GardenView';
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import NotFound from "./components/Layout/NotFound";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-100 to-green-200 font-pixel" role="application">
                    <header role="banner">
                        <Navbar />
                    </header>
                    <main role="main" className="flex-grow container mx-auto px-4 py-8">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route 
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route 
                                path="/garden"
                                element={
                                    <PrivateRoute>
                                        <GardenView />
                                    </PrivateRoute>
                                }
                            />
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                    <footer role="contentinfo">
                        <Footer />
                    </footer>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;