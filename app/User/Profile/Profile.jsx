'use client'
import { useState } from 'react';
// import { getSessionAndUser } from '@/app/libs/getSessionProfile';
import AuthButton from '../../components/auth/AuthButton';
import Link from 'next/link';
import Image from 'next/image';
import edit from '../../../public/edit.png';

export default function Profile({ user, lessons }) {
    const TimeLessonS = {
        1: '8:30',
        2: '10:15',
        3: '12:00',
        4: '14:15',
        5: '16:00',
        6: '17:50',
    };
    const TimeLessonPo = {
        1: '10:05',
        2: '11:50',
        3: '13:35',
        4: '15:50',
        5: '17:35',
        6: '21:00',
    };
    const TimeOptions = { weekday: 'long', month: 'long', day: 'numeric' };

    const now = new Date();
    const futureLessons = lessons.filter(lesson => new Date(lesson.date) > now);
    const pastLessons = lessons.filter(lesson => new Date(lesson.date) <= now);

    const [showMore, setShowMore] = useState(false);

    const handleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <section>
            <div className='container bg-white rounded-xl py-10'>
                {user && (
                    <>
                        <div className='border rounded-3xl '>
                            <div className='flex m-auto flex-col justify-center items-center'>
                                <h2 className='font-bold text-center text-2xl mt-4'>Личная информация <hr className='bg-[#FF9100] -mx-6 h-[2px]'></hr></h2>
                            </div>
                            <div className='flex items-center justify-around'>
                                <div className='flex flex-col m-10 gap-5 w-2/4'>
                                    <div className='flex flex-col'><span className='text-lg text-stone-500 m-3'>ФИО: </span><span className='w-2/4 font-bold text-stone-500 border rounded-3xl p-4'>{user.userName}</span></div>
                                    <div className='flex flex-col'><span className='text-lg text-stone-500 m-3'>Почта: </span><span className='w-2/4 font-bold text-stone-500 border rounded-3xl p-4'>{user.email}</span></div>

                                </div>

                                <div className='flex items-center justify-center '>
                                    <a href='#' className='flex border items-center justify-center border-[#FF9100] rounded-2xl bg-[#FF9100] py-3 px-12'>
                                        <AuthButton />
                                    </a>
                                </div>
                            </div>

                        </div>

                        <div className='mt-10 border rounded-3xl'>
                            <div className='flex m-auto flex-col justify-center items-center'>
                                <h2 className='font-bold text-center text-2xl mt-4'>Будущие занятия <hr className='bg-[#FF9100] -mx-6 h-[2px]'></hr></h2>
                            </div>
                            <div className='flex items-center justify-center flex-wrap gap-5'>
                                {futureLessons.length > 0 ? (
                                    futureLessons.map((lesson) => (
                                        <div key={lesson.id} className='flex flex-col m-5 p-5 gap-3 items-center justify-center border rounded-3xl w-3/12'>
                                            <p><strong>Дата:</strong> {lesson.date.toLocaleDateString('ru-RU', TimeOptions)}</p>
                                            <p><strong>Время:</strong> {TimeLessonS[lesson.numberLesson]}-{TimeLessonPo[lesson.numberLesson]}</p>
                                            <p><strong>Студент:</strong> {lesson.studentName}</p>
                                            <p><strong>Описание:</strong> {lesson.description}</p>
                                            <div>
                                                <Link href={`/Admin/book/UpdatePage/${lesson.id}`}>
                                                    <button className="flex items-center justify-center  w-[35px] h-[35px] rounded-md ">
                                                        <Image className='w-8 h-8 m-5  bg-[#FF9100] rounded-lg p-1' src={edit} alt='editImg' />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className='font-bold text-center text-2xl mt-4 p-5'>У вас нет добавленных занятий.</p>
                                )}
                            </div>
                        </div>

                        <div className='mt-10 border rounded-3xl'>
                            <div className='flex flex-col justify-center items-center'>
                                <h2 className='font-bold text-center text-2xl mt-4'>Прошедшие занятия <hr className='bg-[#FF9100] -mx-6 h-[2px]'></hr></h2>
                            </div>
                            <div className='flex items-center justify-center flex-wrap gap-5'>
                                {pastLessons.length > 0 ? (
                                    <>
                                        {pastLessons.slice(0, 3).map((lesson) => (
                                            <div key={lesson.id} className='flex flex-col m-5 p-5 gap-3 items-center justify-center border rounded-3xl w-3/12'>
                                                <p><strong>Дата:</strong> {lesson.date.toLocaleDateString('ru-RU', TimeOptions)}</p>
                                                <p><strong>Время:</strong> {TimeLessonS[lesson.numberLesson]}-{TimeLessonPo[lesson.numberLesson]}</p>
                                                <p><strong>Студент:</strong> {lesson.studentName}</p>
                                                <p><strong>Описание:</strong> {lesson.description}</p>
                                            </div>
                                        ))}
                                        {showMore && pastLessons.slice(3).map((lesson) => (
                                            <div key={lesson.id} className='flex flex-col m-5 p-5 gap-3 items-center justify-center border rounded-3xl w-3/12'>
                                                <p><strong>Дата:</strong> {lesson.date.toLocaleDateString('ru-RU', TimeOptions)}</p>
                                                <p><strong>Время:</strong> {TimeLessonS[lesson.numberLesson]}-{TimeLessonPo[lesson.numberLesson]}</p>
                                                <p><strong>Студент:</strong> {lesson.studentName}</p>
                                                <p><strong>Описание:</strong> {lesson.description}</p>
                                            </div>
                                        ))}
                                        <div className='flex justify-center w-full '>
                                            <button onClick={handleShowMore} className='mb-5 px-4 py-2 bg-[#FF9100] text-white rounded-3xl'>
                                                {showMore ? 'Скрыть' : 'Показать еще'}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p className='font-bold text-center text-2xl mt-4 p-5'>У вас нет прошедших занятий.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

        </section>
    );
}
