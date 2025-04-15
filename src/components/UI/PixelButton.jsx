function PixelButton({ children, className = "", ...props }) {
    return (
        <button
            className={`px-4 py-2 font-bold text-white bg-green-600 hover:bg-green-700 border-4 border-black rounded shadow-pixel transition-transform duration-100 active:translate-y-1 ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export default PixelButton