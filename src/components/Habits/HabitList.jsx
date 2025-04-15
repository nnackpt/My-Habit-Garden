import HabitItem from './HabitItem'

function HabitList({ habits, onWater, onDelete }) {
    return (
        <div className='space-y-4'>
            {habits.map(habit => (
                <HabitItem 
                    key={habit._id}
                    habit={habit}
                    onWater={onWater}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}

export default HabitList