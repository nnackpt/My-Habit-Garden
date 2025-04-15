function PlantGrapic({ waterLevel = 0 }) {
    let stage = 0
    if (waterLevel >= 3) stage = 1 // sprout
    if (waterLevel >= 7) stage = 2 // small plant
    if (waterLevel >= 15) stage = 3 // medium plant
    if (waterLevel >= 25) stage = 4 // large plant
    if (waterLevel >= 40) stage = 5 // flowering plant

    const platGraphics = [
        // stage 0: seed
        <div className="flex justify-center items-end h-full">
            <div className="w-6 h-6 bg-yellow-800 rounded-full border-2 border-yellow-900"></div>
        </div>,

        // stage 1: sprout
        <div className="flex justify-center items-end h-full">
            <div className="relative">
                <div className="w-2 h-8 bg-green-600 absolute left-1/2 -ml-1 bottom-0"></div>
                <div className="w-6 h-4 bg-green-500 rounded-full absolute -left-2 bottom-6"></div>
            </div>
        </div>,

        // stage 2: small plant
        <div className="fles justify-center items-end h-full">
            <div className="relative">
                <div className="w-2 h-12 bg-green-600 absolute left-1/2 -ml-1 bottom-0"></div>
                <div className="w-8 h-5 bg-green-500 rounded-full absolute -left-3 bottom-10"></div>
                <div className="w-8 h-5 bg-green-500 rounded-full absolute -left-3 bottom-6"></div>
            </div>
        </div>,

        // stage 3: medium plant
        <div className="flex justify-center items-end h-full">
            <div className="relative">
                <div className="w-3 h-16 bg-green-700 absolute left-1/2 -ml-1.5 bottom-0"></div>
                <div className="w-10 h-6 bg-green-500 rounded-full absolute -left-3.5 bottom-14"></div>
                <div className="w-10 h-6 bg-green-500 rounded-full absolute -left-3.5 bottom-10"></div>
                <div className="w-10 h-6 bg-green-500 rounded-full absolute -left-3.5 bottom-6"></div>
            </div>
        </div>,

        // stage 4: large plant
        <div className="flex justify-center items-end h-full">
            <div className="relative">
                <div className="w-4 h-20 bg-green-700 absolute left-1/2 -ml-2 bottom-0"></div>
                <div className="w-12 h-6 bg-green-600 rounded-full absolute -left-4 bottom-18"></div>
                <div className="w-12 h-6 bg-green-600 rounded-full absolute -left-4 bottom-14"></div>
                <div className="w-12 h-6 bg-green-500 rounded-full absolute -left-4 bottom-10"></div>
                <div className="w-12 h-6 bg-green-500 rounded-full absolute -left-4 bottom-6"></div>
            </div>
        </div>,

        // stage 5: flowering plant
        <div className="flex justify-center items-end h-full">
            <div className="relative">
                <div className="w-4 h-24 bg-green-700 absolute left-1/2 -ml-2 bottom-0"></div>
                <div className="w-16 h-8 bg-green-600 rounded-full absolute -left-6 bottom-20"></div>
                <div className="w-16 h-8 bg-green-600 rounded-full absolute -left-6 bottom-14"></div>
                <div className="w-16 h-8 bg-green-500 rounded-full absolute -left-6 bottom-8"></div>
                <div className="w-6 h-6 bg-pink-400 rounded-full absolute -left-1 bottom-22"></div>
                <div className="w-6 h-6 bg-pink-400 rounded-full absolute -left-1 top-0"></div>
            </div>
        </div>
    ]

    return (
        <div className="w-full h-full">
            {platGraphics[stage]}
        </div>
    )
}

export default PlantGrapic