import PixelButton from '../UI/PixelButton';
import PlantGraphic from '../Garden/PlantGraphic';

function HabitItem({ habit, onWater, onDelete }) {
  const handleWater = () => {
    onWater(habit._id);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      onDelete(habit._id);
    }
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow-md border-4 border-black'>
        <div className='flex flex-wrap md:flex-nowrap'>
            <div className='w-24 h-24 flex-shrink-0 mr-4'>
                <PlantGraphic waterLevel={habit.water_level}/>
            </div>

            <div className='flex-grow'>
                <div className='flex justify-between'>
                    <h3 className='text-xl font-bold text-green-700'>{habit.name}</h3>
                    <div className='text-yellow-600 font-bold'>
                        💧 Level: {habit.water_level}
                    </div>
                </div>

                {habit.description && (
                    <p className='text-gray-600 mt-1'>{habit.description}</p>
                )}

                <div className='mt-3 flex space-x-3'>
                    <PixelButton
                        onClick={handleWater}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        💧 Water
                    </PixelButton>

                    <PixelButton
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        🗑️ Delete
                    </PixelButton>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HabitItem