function HabitStats({ stats }) {
    if (!stats) return null

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border-4 border-black">
            <h2 className="text-xl font-bold md-4 text-green-700 text-center">Your Garden Stats</h2>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-600">Active Habits:</span>
                    <span className="bg-green-100 px-3 py-1 rounded-lg text-green-700">{stats.active_habits}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-600">Total Habits:</span>
                    <span className="bg-blue-100 px-3 py-1 rounded-lg text-blue-700">{stats.total_habits}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-600">Total Water Given:</span>
                    <span className="bg-blue-100 px-3 py-1 rounded-lg text-blue-700">💧 {stats.total_water}</span>
                </div>

                {stats.best_habit && (
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                        <div className="font-bold mb-2 text-gray-600">Your Strongest Habit:</div>
                        <div className="bg-yellow-100 p-2 rounded-lg">
                            <div className="font-bold text-green-700">{stats.best_habit.name}</div>
                            <div className="text-sm text-blue-300">💧 Water Level: {stats.best_habit.water_level}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HabitStats