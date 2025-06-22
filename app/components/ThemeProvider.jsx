'use client'
import { createContext, useEffect } from 'react'
import MenuWeek from './MenuWeek';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { endOfWeek, startOfWeek } from 'date-fns';

export const ThemeContext = createContext()

export default function ThemeProvider({ children, session }) {
    const [weeks, setWeeks] = useState(() => {
        // Инициализируем weeks при первой загрузке
        const today = new Date();
        const currentWeek = {
            from: startOfWeek(today, { weekStartsOn: 1 }),
            to: endOfWeek(today, { weekStartsOn: 1 }),
        };
        console.log('Инициализация ThemeProvider weeks:', currentWeek);
        return currentWeek;
    });
    const pathname = usePathname();

    // Логируем изменения weeks
    useEffect(() => {
        console.log('ThemeProvider weeks изменился:', weeks);
    }, [weeks]);

    return (
        <ThemeContext.Provider value={{ weeks, setWeeks }}>
            {session && (pathname === '/User/TimeTable' || pathname === '/Admin/TimeTableAdmin') && (
                <div>
                    <MenuWeek />
                </div>
            )}
            {children}
        </ThemeContext.Provider>
    )
}
