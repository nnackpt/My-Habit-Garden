function Footer() {
    return (
        <footer className="bg-green-800 border-t-4 border-black text-white py-4">
            <div className="container mx-auto px-4 text-center">
                <p>My Habit Garden &copy; {new Date().getFullYear()} - Grow your habits, grow yourself!</p>
            </div>
        </footer>
    )
}

export default Footer