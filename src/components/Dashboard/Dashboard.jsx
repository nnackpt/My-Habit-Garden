import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import { useAuth } from '../../context/AuthContext'
import HabitList from '../Habits/HabitList'
import HabitForm from '../Habits/HabitForm'
import HabitStats from '../Habits/HabitStats'
import PixelButton from '../UI/PixelButton'

function Dashboard() {
    const [habits, setHabits] = useState([])
    const [stats, setStats] = useState(null)
    const [isModalOpen, setIsModelOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const { currentUser } = useAuth()

    const fetchHabits = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://127.0.0.1:8000/habits', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setHabits(response.data)
        } catch (err) {
            console.error("Failed to fetch habits:", err)
        }
    }

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://127.0.0.1:8000/habits/stats', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setStats(response.data)
        } catch (err) {
            console.error("Failed to fetch stats:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHabits()
        fetchStats()
    }, [])

    const handleAddHabit = async (name, description) => {
        try {
            const token = localStorage.getItem('token')
            await axios.post('http://127.0.0.1:8000/habits',
                { name, description },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setIsModelOpen(false)
            fetchHabits()
            fetchStats()
        } catch (err) {
            console.error("Failed to add habit:", err)
        }
    }

    const handleWaterHabit = async (habitId) => {
        try {
            const token = localStorage.getItem('token')
            await axios.post(`http://127.0.0.1:8000/habits/${habitId}/water`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            fetchHabits()
            fetchStats()
        } catch (err) {
            console.error("Failed to water habit:", err)
        }
    }

    const handleDeleteHabit = async (habitId) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://127.0.0.1:8000/habits/${habitId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            fetchHabits()
            fetchStats()
        } catch (err) {
            console.error("Failed to delete habit:", err)
        }
    }

    if (loading) {
        return <div className="text-center mt-8">Loading...</div>
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-green-800 pixel-shadow">
                    Welcome to your Habit Garden, {currentUser. first_name}!
                </h1>
                <p className="mt-2 text-gray-600">Grow your habits like beautiful plants 🌱</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-green-700">Your Habits</h2>
                        <PixelButton onClick={() => setIsModelOpen(true)}>
                            Add new Habit
                        </PixelButton>
                    </div>

                    {habits.length === 0 ? (
                        <div className="bg-white p-6 rounded-lg border-4 border-black text-center">
                            <p className="text-gray-600 mb-4">You don't have any habits yet!</p>
                            <PixelButton onClick={() => setIsModelOpen(true)}>
                                Create Your First Habit
                            </PixelButton>
                        </div>
                    ) : (
                        <HabitList 
                            habits={habits}
                            onWater={handleWaterHabit}
                            onDelete={handleDeleteHabit}
                        />
                    )}
                </div>

                <div>
                    <HabitStats stats={stats}/>
                    <div className="mt-6 text-center">
                        <Link to="/garden">
                            <PixelButton>
                                View Your Garden
                            </PixelButton>
                        </Link>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg border-4 border-black w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-green-700">Add New Habit</h2>
                        <HabitForm 
                            onSubmit={handleAddHabit}
                            onCancel={() => setIsModelOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard