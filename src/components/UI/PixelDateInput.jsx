import React from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import './pixel-calendar.css'
import { enUS } from 'date-fns/locale'

export default function PixelDateInput({ value, onChange }) {
    return (
        <DatePicker 
            selected={value}
            onChange={onChange}
            locale={enUS}
            dateFormat="MMMM d, yyyy"
            placeholderText="Select your birth date"
            className="w-full px-4 py-2 font-pixel text-gray-800 bg-white border-4 border-black focus:outline-none cursor-pointer"
            calendarClassName="pixel-calendar-container"
            popperPlacement="bottom-start"
        />
    )
}