import { useState } from "react";
import PixelButton from '../UI/PixelButton'
import PixelInput from '../UI/PixelInput'

function HabitForm({ onSubmit, onCancel }) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) {
            alert("Please enter a habit name.")
            return
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/habits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    name: name,
                    description: description || null,
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.detail || "Failed to create habit")
            }

            const data = await response.json()
            console.log("Habit created:", data)
            setName("")
            setDescription("")
        } catch (error) {
            console.error("Error creating habit:", error.message)
            alert(`Failed to create habit: ${error.message}`)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="bloack text-gray-700 font-bold mb-2">
                    Habit Name*
                </label>
                <PixelInput 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g., Drink Water, Exercise, Read"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                    Description (Optional)
                </label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Drink 2 liters of water daily"
                    className="w-full px-3 py-2 border-4 border-gray-800 rounded bg-white font-pixel text-lg text-gray-600"
                    rows="3"
                ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
                <PixelButton 
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 hover:bg-gray-600"
                >
                    Cancel
                </PixelButton>
                <PixelButton type="submit">
                    create Habit
                </PixelButton>
            </div>
        </form>
    )
}

export default HabitForm