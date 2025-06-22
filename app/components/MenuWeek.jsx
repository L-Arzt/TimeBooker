'use client';
import { useContext, useEffect, useState } from 'react';
import { Calendar } from '../../components/ui/calendar';
import { endOfWeek, isSameWeek, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { ThemeContext } from './ThemeProvider';
import Image from 'next/image';
import burderMenu from '../../public/burgermenu.png';
import glaz from '../../public/glaz.png';

export default function MenuWeek() {
    const [selectedWeek, setSelectedWeek] = useState();
    const [menuVisible, setMenuVisible] = useState(false);
    const context = useContext(ThemeContext);

    useEffect(() => {
        // Только если weeks в контексте не определен, инициализируем его
        if (!context.weeks || !context.weeks.from) {
            const today = new Date();
            const currentWeek = {
                from: startOfWeek(today, { weekStartsOn: 1 }),
                to: endOfWeek(today, { weekStartsOn: 1 }),
            };
            console.log('Инициализация недели в MenuWeek (weeks не был определен):', { 
                today, 
                currentWeek,
                todayDay: today.getDay(),
                adjustedDay: today.getDay() === 0 ? 7 : today.getDay()
            });
            setSelectedWeek(currentWeek);
            context.setWeeks(currentWeek);
        } else {
            // Если weeks уже определен в контексте, используем его
            console.log('MenuWeek: weeks уже определен в контексте:', context.weeks);
            setSelectedWeek(context.weeks);
        }
    }, [context]);
    
    // Функция для обновления недели с дополнительной логикой сброса hover-эффектов
    const updateWeek = (newWeek) => {
        setSelectedWeek(newWeek);
        context.setWeeks(newWeek);
        
        // Создаем пользовательское событие для оповещения других компонентов о смене недели
        const weekChangeEvent = new CustomEvent('weekChanged', { detail: newWeek });
        document.dispatchEvent(weekChangeEvent);
    };

    return (
        <section className="flex justify-center items-center flex-col z-10">
            <div className="flex justify-center items-center">
                <button
                    className=""
                    onClick={() => setMenuVisible(!menuVisible)}
                >
                    {menuVisible ? (
                        <></>
                    ) : (
                        <div className="flex items-center justify-center bg-[#ff910075] min-w-10 h-[30px] rounded-md text-stone-50 p-5 hover:bg-[#FF9100]">
                            <h3>Сменить неделю</h3>
                            {/* <Image className="w-6 h-6 m-4" src={burderMenu} alt="glaz" /> */}
                        </div>
                    )}
                </button>
            </div>

            {menuVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center flex-col  gap-5 z-50 " onClick={() => setMenuVisible(false)}>
                    <button
                        className="flex items-center justify-center transition-all duration-200 bg-red-600 text-white p-2 rounded shadow-lg transform hover:scale-105"
                        onClick={() => setMenuVisible(false)}
                    >
                        Скрыть календарь
                    </button>
                    <div className="relative bg-white p-5 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>

                        <Calendar
                            className="calendar_custom p-0"
                            locale={ru}
                            modifiers={{ selected: selectedWeek }}
                            onDayClick={(day, modifiers) => {
                                if (modifiers.selected) {
                                    updateWeek(undefined);
                                    return;
                                }
                                const newWeek = {
                                    from: startOfWeek(day, { weekStartsOn: 1 }),
                                    to: endOfWeek(day, { weekStartsOn: 1 }),
                                };
                                updateWeek(newWeek);
                            }}
                            onWeekNumberClick={(weekNumber, dates) => {
                                if (selectedWeek?.from && isSameWeek(dates[0], selectedWeek.from)) {
                                    updateWeek(undefined);
                                    return;
                                }
                                const newWeek = {
                                    from: startOfWeek(dates[0]),
                                    to: endOfWeek(dates[dates.length - 1]),
                                };
                                updateWeek(newWeek);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* <div>
                {selectedWeek && (
                    <p>
                        Выбранная неделя {selectedWeek.from.toLocaleDateString()} - {selectedWeek.to.toLocaleDateString()}
                    </p>
                )}
            </div> */}
        </section>
    );
}
