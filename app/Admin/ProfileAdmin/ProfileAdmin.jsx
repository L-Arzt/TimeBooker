'use client'
import { useState, useRef } from 'react';
import AuthButton from '../../components/auth/AuthButton';
import Link from 'next/link';
import edit from '../../../public/edit.png';
import Image from 'next/image';

export default function ProfileAdmin({ user, lessons }) {
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
    const [selectedStudentName, setSelectedStudentName] = useState('all');
    const [showMoreFuture, setShowMoreFuture] = useState(false);
    const [showMorePast, setShowMorePast] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [telegramId, setTelegramId] = useState(user.settings?.telegramId || '');
    const [testType, setTestType] = useState('user');
    const testTypes = [
        { value: 'user', label: 'Тестовое уведомление для пользователя' },
        { value: 'admin', label: 'Тестовое уведомление для администратора' },
        { value: 'business', label: 'Тестовое уведомление для бизнеса' },
    ];

    const handleShowMoreFuture = () => {
        setShowMoreFuture(!showMoreFuture);
    };

    const handleShowMorePast = () => {
        setShowMorePast(!showMorePast);
    };

    const handleUserChange = (event) => {
        const value = event.target.value;
        setSelectedStudentName(value);
    };

    const sendTestNotification = async () => {
        setIsLoading(true);
        setMessage('');
        try {
            const response = await fetch('/api/notifications/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, type: testType }),
            });
            if (response.ok) {
                setMessage('Тестовое уведомление отправлено');
            } else {
                setMessage('Ошибка при отправке тестового уведомления');
            }
        } catch (e) {
            setMessage('Ошибка при отправке тестового уведомления');
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleSave = () => {
        // Implementation of handleSave function
    };

    const uniqueStudentNames = Array.from(new Set(lessons.map(lesson => lesson.studentName)));
    const filteredLessons = selectedStudentName === "all" ? lessons : lessons.filter(lesson => lesson.studentName === selectedStudentName);
    const futureLessons = filteredLessons.filter(lesson => new Date(lesson.date) > now);
    const pastLessons = filteredLessons.filter(lesson => new Date(lesson.date) <= now);

    const sortedFutureLessons = futureLessons.sort((a, b) => a.id - b.id);
    const sortedPastLessons = pastLessons.sort((a, b) => a.id - b.id);

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
                                <h2 className='font-bold text-center text-2xl mt-4'>Регистрация пользователей</h2>
                                <button className="flex border items-center justify-center border-[#FF9100] rounded-2xl bg-[#FF9100] py-2 px-6 m-4 p-3">
                                    <Link className='flex gap-2' href="/register"> <h3 className="text-white">Регистрация</h3></Link>
                                </button>
                            </div>
                        </div>

                        <div className='mt-10 border rounded-3xl p-6'>
                            <div className='flex m-auto flex-col justify-center items-center'>
                                <h2 className='font-bold text-center text-2xl mt-4'>Тестирование уведомлений</h2>
                                <div className='space-y-4 mt-4'>
                                    <p className='text-stone-500 text-center'>
                                        Выберите тип тестового уведомления и отправьте его себе для проверки.
                                    </p>
                                    <div className='flex flex-col items-center gap-4'>
                                        <select
                                            value={testType}
                                            onChange={e => setTestType(e.target.value)}
                                            className='border rounded-3xl px-4 py-2 text-lg'
                                        >
                                            {testTypes.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={sendTestNotification}
                                            disabled={isLoading}
                                            className={`px-6 py-4 bg-[#FF9100] text-white rounded-3xl hover:bg-orange-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isLoading ? 'Отправка...' : 'Отправить тестовое уведомление'}
                                        </button>
                                    </div>
                                    {message && (
                                        <div className={`mt-4 p-4 rounded-3xl ${message.includes('ошибка') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {message}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='mt-10 border rounded-3xl'>
                            <div className='flex m-auto flex-col justify-center items-center'>
                                <h2 className='font-bold text-center text-2xl mt-4'>Настройки уведомлений <hr className='bg-[#FF9100] -mx-6 h-[2px]'></hr></h2>
                            </div>
                            <div className='flex items-center justify-center flex-wrap gap-5'>
                                <div className='flex flex-col m-10 gap-5 w-2/4'>
                                    <div className='flex flex-col'>
                                        <label className='text-lg text-stone-500 m-3'>ID мессенджера (Telegram chatId)</label>
                                        {isEditing ? (
                                            <div className='mt-1 flex gap-2'>
                                                <input
                                                    type='text'
                                                    value={telegramId}
                                                    onChange={(e) => setTelegramId(e.target.value)}
                                                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500'
                                                    placeholder='Введите ваш Telegram chatId'
                                                />
                                                <button
                                                    onClick={handleSave}
                                                    className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600'
                                                >
                                                    Сохранить
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setTelegramId(user.settings?.telegramId || '');
                                                    }}
                                                    className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600'
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        ) : (
                                            <div className='mt-1 flex items-center gap-2'>
                                                <p>{telegramId || 'Не указан'}</p>
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className='text-orange-500 hover:text-orange-600'
                                                >
                                                    Изменить
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {user.role === 'business' ? (
                            <div className='mt-10 border rounded-3xl p-10 text-center text-xl text-red-600 font-bold'>
                                Таблица администратора недоступна для бизнес-аккаунта. Вы видите только свои занятия.
                            </div>
                        ) : (
                            <>
                                <div className='mt-10 border rounded-3xl'>
                                    <div className='flex m-auto flex-col justify-center items-center'>
                                        <h2 className='font-bold text-center text-2xl mt-4'>Выберите пользователя</h2>
                                        <select onChange={handleUserChange} value={selectedStudentName} className='m-4 p-3 border rounded-3xl '>
                                            <option value="all">Все пользователи</option>
                                            {uniqueStudentNames.map((name, idx) => (
                                                <option key={idx + '-' + name} value={name}>{name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='mt-10 border rounded-3xl'>
                                    <div className='flex m-auto flex-col justify-center items-center'>
                                        <h2 className='font-bold text-center text-2xl mt-4'>Будущие занятия <hr className='bg-[#FF9100] -mx-6 h-[2px]'></hr></h2>
                                    </div>
                                    <div className='flex items-center justify-center flex-wrap gap-5'>
                                        {sortedFutureLessons.length > 0 ? (
                                            <>
                                                {sortedFutureLessons.slice(0, showMoreFuture ? sortedFutureLessons.length : 3).map((lesson) => (
                                                    <div key={lesson.id} className='flex flex-col m-5 p-5 gap-3 items-center justify-center border rounded-3xl w-3/12'>
                                                        <p><strong>Дата:</strong> {new Date(lesson.date).toLocaleDateString('ru-RU', TimeOptions)}</p>
                                                        <p><strong>Время:</strong> {TimeLessonS[lesson.numberLesson]}-{TimeLessonPo[lesson.numberLesson]}</p>
                                                        <p><strong>Студент:</strong> {lesson.studentName}</p>
                                                        <p><strong>Бизнес:</strong> {lesson.business?.name || '—'}</p>
                                                        <p><strong>Описание:</strong> {lesson.description}</p>
                                                        <div>
                                                            <Link href={`/Admin/book/UpdatePage/${lesson.id}`}>
                                                                <button className="flex items-center justify-center  w-[35px] h-[35px] rounded-md ">
                                                                    <Image className='w-8 h-8 m-5  bg-[#FF9100] rounded-lg p-1' src={edit} alt='editImg' />
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className='flex justify-center w-full '>
                                                    <button onClick={handleShowMoreFuture} className='mb-5 px-4 py-2 bg-[#FF9100] text-white rounded-3xl'>
                                                        {showMoreFuture ? 'Скрыть' : 'Показать еще'}
                                                    </button>
                                                </div>
                                            </>
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
                                        {sortedPastLessons.length > 0 ? (
                                            <>
                                                {sortedPastLessons.slice(0, showMorePast ? sortedPastLessons.length : 3).map((lesson) => (
                                                    <div key={lesson.id} className='flex flex-col m-5 p-5 gap-3 items-center justify-center border rounded-3xl w-3/12'>
                                                        <p><strong>Дата:</strong> {new Date(lesson.date).toLocaleDateString('ru-RU', TimeOptions)}</p>
                                                        <p><strong>Время:</strong> {TimeLessonS[lesson.numberLesson]}-{TimeLessonPo[lesson.numberLesson]}</p>
                                                        <p><strong>Студент:</strong> {lesson.studentName}</p>
                                                        <p><strong>Бизнес:</strong> {lesson.business?.name || '—'}</p>
                                                        <p><strong>Описание:</strong> {lesson.description}</p>
                                                        <div>
                                                            <Link href={`/Admin/book/UpdatePage/${lesson.id}`}>
                                                                <button className="flex items-center justify-center  w-[35px] h-[35px] rounded-md ">
                                                                    <Image className='w-8 h-8 m-5  bg-[#FF9100] rounded-lg p-1' src={edit} alt='editImg' />
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className='flex justify-center w-full '>
                                                    <button onClick={handleShowMorePast} className='mb-5 px-4 py-2 bg-[#FF9100] text-white rounded-3xl'>
                                                        {showMorePast ? 'Скрыть' : 'Показать еще'}
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
                    </>
                )}
            </div>
        </section>
    );
}
