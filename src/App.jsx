import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './components/Dashboard/Dashboard'
import GardenView from './components/Garden/GardenView'
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from './components/Auth/PrivateRoute'

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h screen bg-green-100 font-pixel">
                    <Navbar />
                    <main className="flex-grow container mx-auto px-4 py-8">
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
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App