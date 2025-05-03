'use client'
import { createContext } from 'react'
import MenuWeek from './MenuWeek';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
export const ThemeContext = createContext()

export default function ThemeProvider({ children, session }) {
    const [weeks, setWeeks] = useState()
    const pathname = usePathname();
    return (
        <ThemeContext.Provider value={{ weeks, setWeeks }}>
            {/* {session && (pathname === '/User/TimeTable' || pathname === '/Admin/TimeTableAdmin') && (
                <div>
                    <MenuWeek />
                </div>
            )} */}
            {children}
        </ThemeContext.Provider>
    )
}
