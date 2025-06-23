"use client";

import { useContext, useEffect, useRef, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '/components/ui/table';
import Link from 'next/link';
import { ThemeContext } from '../../../../components/ThemeProvider.jsx';
import edit from '@/public/edit.png';
import Image from 'next/image';
import MenuWeek from '@/app/components/MenuWeek';
import nextImg from '@/public/arrownexttable.png';
import backImg from '@/public/arrowbacktable.png';
import { useParams } from 'next/navigation';
import { getSession } from 'next-auth/react';

export default function TimeTable({ data, weekRange }) {
    const [dataset, setDataset] = useState(data);
    const [hover, setHover] = useState({});
    const [currentDay, setCurrentDay] = useState(() => {
        const today = new Date().getDay();
        let adjustedDay = today === 0 ? 7 : today;
        if (adjustedDay < 1 || adjustedDay > 7) adjustedDay = 1;
        return adjustedDay;
    });
    const [showWeek, setShowWeek] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentWeek, setCurrentWeek] = useState({ from: weekRange.from, to: weekRange.to });

    const context = useContext(ThemeContext);
    const slideContainerRef = useRef(null);
    const tableRef = useRef(null);
    const params = useParams();
    const slug = params?.slug;

    useEffect(() => {
        function handleClickOutside(event) {
            if (tableRef.current && !tableRef.current.contains(event.target) || 
                (event.target.closest('.table-cell-empty'))) {
                setHover({});
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setHover({});
    }, [currentDay, showWeek, dataset]);

    useEffect(() => {
        const handleWeekChange = () => {
            setHover({});
        };
        document.addEventListener('weekChanged', handleWeekChange);
        return () => {
            document.removeEventListener('weekChanged', handleWeekChange);
        };
    }, []);

    const handleMouseEnter = (lessonId) => {
        setHover(prev => ({ ...prev, [lessonId]: true }));
    };
    const handleMouseLeave = (lessonId) => {
        setTimeout(() => {
            setHover(prev => {
                if (prev[lessonId]) {
                    const newState = { ...prev };
                    delete newState[lessonId];
                    return newState;
                }
                return prev;
            });
        }, 50);
    };

    function getDateFromDay(date, day) {
        var result = new Date(date);
        result.setDate(result.getDate() + (day - 1));
        return result.toLocaleDateString('en-CA');
    }

    const daysOnWeek = [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье'
    ];

    useEffect(() => {
        async function fetchCurrentUser() {
            const session = await getSession();
            if (session) {
                setCurrentUser(session.user);
            }
        }
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (context.weeks && currentUser && slug) {
            async function getData() {
                const resp = await fetch(`/api/getTimeTable?slug=${slug}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        monday: context.weeks.from,
                        sunday: context.weeks.to,
                        userId: currentUser.id,
                        slug: slug,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (resp.ok) {
                    const data = await resp.json();
                    setDataset(data.data);
                }
            }
            getData();
        }
    }, [context.weeks, currentUser, slug]);

    function handlePrevDay() {
        setCurrentDay((prevDay) => (prevDay === 1 ? 7 : prevDay - 1));
    }
    function handleNextDay() {
        setCurrentDay((prevDay) => (prevDay === 7 ? 1 : prevDay + 1));
    }
    function toggleShowWeek() {
        setShowWeek((prevShowWeek) => !prevShowWeek);
    }

    function buildTable(data) {
        const TimeLessonS = {
            1: '09:00',
            2: '10:10',
            3: '11:20',
            4: '12:30',
            5: '13:40',
            6: '14:50',
            7: '16:00',
            8: '17:10',
            9: '18:20',
          };
          
          const TimeLessonPo = {
            1: '10:00',
            2: '11:10',
            3: '12:20',
            4: '13:30',
            5: '14:40',
            6: '15:50',
            7: '17:00',
            8: '18:10',
            9: '19:20',
          };
        let table = [];
        for (let i = 1; i <= Object.keys(TimeLessonS).length; i++) {
            let tablePart = (
                <TableRow className='transition-all duration-300 ease-in-out hover:bg-gray-100 shadow-sm rounded-md' key={`row-${i}`}>
                    <TableCell className="py-3 px-5 font-medium text-gray-700">{TimeLessonS[i]}<hr />{TimeLessonPo[i]}</TableCell>
                    {showWeek ? (
                        daysOnWeek.map((dayName, dayIndex) => {
                            const lesson = data.find(
                                (lesson) => lesson.weekDay === dayIndex + 1 && lesson.numberLesson === i
                            );
                            return (
                                <TableCell className="py-3 px-5 border-t border-gray-300" key={`lesson-${i}-${dayIndex}`}>
                                    {lesson ? (
                                        currentUser && lesson.userId === currentUser.id ? (
                                            <div className="relative w-[140px] h-[70px] flex flex-col items-center justify-center transition-all duration-200" 
                                                onMouseEnter={() => handleMouseEnter(lesson.id)} 
                                                onMouseLeave={() => handleMouseLeave(lesson.id)}>
                                                {hover[lesson.id] ? (
                                                    <div className={`absolute z-20 flex items-center justify-center w-[250px] h-[120px] p-2 bg-white rounded-lg shadow-xl gap-2 ${dayIndex >= 5 ? 'right-0' : ''}`}>
                                                        <div className='flex-col'>
                                                            <p className="font-semibold text-gray-800">{lesson.studentName}</p>
                                                            <p className="text-gray-600">{lesson.description}</p>
                                                        </div>
                                                        <div>
                                                            <Link href={`/business/${slug}/user/book/UpdatePage/${lesson.id}`}>
                                                                <button className="flex items-center justify-center bg-[#FF9100] w-[35px] h-[35px] rounded-md text-white">
                                                                    <Image className='w-8 h-8 m-1 bg-[#FF9100] rounded-lg p-1' src={edit} alt='editImg' />
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='absolute'>
                                                        <p className="z-0 text-gray-600">{lesson.studentName.slice(0, 10)}...</p>
                                                        <p className="z-0 text-gray-600">{lesson.description.slice(0, 10)}...</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className='flex w-[140px] h-[70px] items-center justify-center flex-col gap-2'>
                                                <h1 className='text-[#7E7E7E]'>Занято</h1>
                                            </div>
                                        )
                                    ) : (
                                        <div className='flex w-[140px] h-[70px] items-center justify-center flex-col gap-2 table-cell-empty'>
                                            <h1 className='text-[#7E7E7E]'>Свободно</h1>
                                            <Link
                                                href={`/business/${slug}/user/book/${i}/${dayIndex + 1}/${getDateFromDay(
                                                    new Date(context?.weeks?.from),
                                                    dayIndex + 1
                                                )}`}
                                            >
                                                <button className="flex items-center justify-center bg-[#FF910075] h-[30px] rounded-md text-stone-50 p-5 hover:bg-[#FF9100] transition-all shadow-lg transform hover:scale-105">
                                                    Забронировать
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </TableCell>
                            );
                        })
                    ) : (
                        <TableCell className="py-3 px-5 border-t" key={`lesson-${i}-${currentDay}`}> 
                            {data.map((lesson) => {
                                if (lesson.weekDay === currentDay && lesson.numberLesson === i) {
                                    return currentUser && lesson.userId === currentUser.id ? (
                                        <div className="relative w-[400px] h-[70px] flex flex-col items-center justify-center transition-all duration-200" 
                                            onMouseEnter={() => handleMouseEnter(lesson.id)} 
                                            onMouseLeave={() => handleMouseLeave(lesson.id)}>
                                            {hover[lesson.id] ? (
                                                <div className='absolute z-20 flex items-center justify-center w-[250px] h-[120px] p-2 bg-white rounded-lg shadow-xl gap-2 right-auto'>
                                                    <div className='flex-col'>
                                                        <p className="font-semibold text-gray-800">{lesson.studentName}</p>
                                                        <p className="text-gray-600">{lesson.description}</p>
                                                    </div>
                                                    <div>
                                                        <Link href={`/business/${slug}/user/book/UpdatePage/${lesson.id}`}>
                                                            <button className="flex items-center justify-center bg-[#FF9100] w-[35px] h-[35px] rounded-md text-white">
                                                                <Image className='w-8 h-8 m-1 bg-[#FF9100] rounded-lg p-1' src={edit} alt='editImg' />
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='absolute'>
                                                    <p className="z-0 text-gray-600">{lesson.studentName.slice(0, 10)}...</p>
                                                    <p className="z-0 text-gray-600">{lesson.description.slice(0, 10)}...</p>
                                                </div>
                                            )}
                                            <div className="h-[30px]"></div>
                                        </div>
                                    ) : (
                                        <div className='flex w-[400px] h-[70px] items-center justify-center flex-col gap-2 table-cell-busy'>
                                            <h1 className='text-[#7E7E7E]'>Занято</h1>
                                            <div className="h-[30px]"></div>
                                        </div>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                            {!data.some((lesson) => lesson.weekDay === currentDay && lesson.numberLesson === i) && (
                                <div className='flex w-[400px] h-[70px] items-center justify-center flex-col gap-2 table-cell-empty'>
                                    <h1 className='text-[#7E7E7E]'>Свободно</h1>
                                    <Link
                                        href={`/business/${slug}/user/book/${i}/${currentDay}/${getDateFromDay(
                                            new Date(context?.weeks?.from),
                                            currentDay
                                        )}`}
                                    >
                                        <button className="flex items-center justify-center bg-[#FF9100] h-[30px] rounded-md text-white p-5 hover:bg-[#FF9100] transition-all shadow-lg transform hover:scale-105">
                                            Забронировать
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </TableCell>
                    )}
                </TableRow>
            );
            table.push(tablePart);
        }
        return table;
    }

    return (
        <section className="relative flex items-center justify-center flex-col overflow-hidden w-full">
            <div className="flex items-center justify-center gap-10 m-5">
                <MenuWeek />
                <button
                    onClick={toggleShowWeek}
                    className="flex items-center justify-center bg-[#FF910075] min-w-10 h-[30px] rounded-md text-stone-50 p-5 hover:bg-[#FF9100] transition-all"
                >
                    {showWeek ? 'Показать один день' : 'Показать всю неделю'}
                </button>
            </div>
            <div className="absolute w-full">
                {!showWeek && (
                    <div className="absolute flex justify-between w-full mt-4 top-[50%] px-10">
                        <button onClick={handlePrevDay} className="relative z-10 p-2">
                            <Image src={backImg} alt="Previous Day" className="pointer-events-none" />
                        </button>
                        <button onClick={handleNextDay} className="relative z-10 p-2">
                            <Image src={nextImg} alt="Next Day" className="pointer-events-none" />
                        </button>
                    </div>
                )}
            </div>
            {dataset && (
                <div className={`overflow-x-scroll ${!showWeek ? 'mr-20' : 'mr-10'} relative`} style={{ paddingRight: showWeek ? '20px' : '0' }}>
                    <Table refProp={slideContainerRef} ref={tableRef}>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-medium"></TableHead>
                                {showWeek
                                    ? daysOnWeek.map((day, index) => (
                                        <TableHead
                                            className="font-semibold text-gray-500 text-sm text-center"
                                            key={day}
                                        >
                                            {day}
                                            <br />
                                            <span className="text-sm text-gray-500">
                                                {new Date(getDateFromDay(new Date(context?.weeks?.from), index + 1))
                                                    .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                                            </span>
                                        </TableHead>
                                        ))
                                    : (
                                        <TableHead className="font-semibold text-gray-500 text-[18px] text-center">
                                            {daysOnWeek[currentDay - 1]}
                                            <br />
                                            <span className="text-sm text-gray-500">
                                                {context?.weeks?.from && new Date(getDateFromDay(new Date(context.weeks.from), currentDay))
                                                    .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                                            </span>
                                        </TableHead>
                                        )
                                    }
                            </TableRow>
                        </TableHeader>
                        <TableBody>{buildTable(dataset)}</TableBody>
                    </Table>
                </div>
            )}
        </section>
    );
} 