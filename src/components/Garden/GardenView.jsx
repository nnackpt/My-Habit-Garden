import { useState, useEffect } from "react";
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import PlantGraphic from './PlantGraphic'

function GardenView() {
    const [habits, setHabits] = useState([])
    const [loading, setLoading] = useState(true)
    const { currentUser } = useAuth()

    useEffect(() => {
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
            } finally {
                setLoading(false)
            }
        }

        fetchHabits()
    }, [])

    if (loading) {
        return <div className="text-center mt-8 text-gray-600">Loading your garden...</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-8 text-green-800 pixel-shadow">
                {currentUser.first_name}'s Habit Garden
            </h1>

            {habits.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg border-4 border-black">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">Your garden is empty!</h2>
                    <p className="mb-4">Start creating habits to grow your garden.</p>
                </div>
            ) : (
                <div className="relative">
                    {/* background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-green-200 rounded-lg border-4 border-black" style={{zIndex: -1}}></div>
                    {/* sun */}
                    <div className="absolute top-4 right-4">
                        <div className="w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-600"></div>
                    </div>
                    {/* garden plots */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-8">
                        {habits.map(habit => (
                            <div key={habit._id} className="text-center">
                                <div className="h-40 relative">
                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-brown-600 rounded-t-lg"></div>
                                    <div className="absolute inset-0 flex items-end justify-center pb-8">
                                        <div className="transform scale-150">
                                            <PlantGraphic waterLevel={habit.water_level} />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white px-4 py-2 rounded-lg border-4 border-black mt-2">
                                    <h3 className="font-bold text-green-700">{habit.name}</h3>
                                    <div className="text-sm text-blue-600">💧 Level: {habit.water_level}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-16"></div>
                </div>
            )}
        </div>
    )
}

export default GardenView;