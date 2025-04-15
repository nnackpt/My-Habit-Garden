function PixelInput({ className = "", ...props }) {
    return (
        <input 
            className={`w-full px-3 py-2 border-4 border-gray-800 rounded bg-white font-pixel text-lg focus:border-green-600 focus:outline-none ${className}`}
            {...props}
        />
    )
}

export default PixelInput