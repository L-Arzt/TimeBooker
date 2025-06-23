'use client'
import { useState } from 'react';
import AuthButton from '@/app/components/auth/AuthButton';
import Link from 'next/link';
import Image from 'next/image';
import edit from '@/public/edit.png';

export default function Profile({ user, lessons }) {
    const [telegramId, setTelegramId] = useState(user?.settings?.telegramId || '');
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [localUser, setLocalUser] = useState(user);
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
    const TimeOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const now = new Date();
    const [showMore, setShowMore] = useState(false);
    const futureLessons = lessons?.filter(lesson => new Date(lesson.date) > now) || [];
    const pastLessons = lessons?.filter(lesson => new Date(lesson.date) <= now) || [];
    const handleSave = async () => {
        try {
            const response = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegramId }),
            });
            if (response.ok) {
                setMessage('Настройки успешно сохранены');
                setIsEditing(false);
                // fetch fresh user data
                const userRes = await fetch('/api/user/profile');
                if (userRes.ok) {
                    const freshUser = await userRes.json();
                    setLocalUser(freshUser);
                    setTelegramId(freshUser.settings?.telegramId || '');
                }
                setTimeout(() => setMessage(''), 3000);
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            setMessage('Ошибка при сохранении настроек');
            console.error('Error saving settings:', error);
        }
    };
    const handleShowMore = () => setShowMore(!showMore);
    if (!localUser) return <div>Загрузка...</div>;
    return (
        <section>
            <div className='container bg-white rounded-xl py-10'>
                <div className='border rounded-3xl '>
                    <div className='flex m-auto flex-col justify-center items-center'>
                        <h2 className='font-bold text-center text-2xl mt-4'>Личная информация <hr className='bg-[#FF9100] -mx-6 h-[2px]'></hr></h2>
                    </div>
                    <div className='flex items-center justify-around'>
                        <div className='flex flex-col m-10 gap-5 w-2/4'>
                            <div className='flex flex-col'><span className='text-lg text-stone-500 m-3'>ФИО: </span><span className='w-2/4 font-bold text-stone-500 border rounded-3xl p-4'>{localUser.userName}</span></div>
                            <div className='flex flex-col'><span className='text-lg text-stone-500 m-3'>Почта: </span><span className='w-2/4 font-bold text-stone-500 border rounded-3xl p-4'>{localUser.email}</span></div>
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
                                        <p><strong>Дата:</strong> {new Date(lesson.date).toLocaleDateString('ru-RU', TimeOptions)}</p>
                                        <p><strong>Время:</strong> {TimeLessonS[lesson.numberLesson]}-{TimeLessonPo[lesson.numberLesson]}</p>
                                        <p><strong>Студент:</strong> {lesson.studentName}</p>
                                        <p><strong>Бизнес:</strong> {lesson.business?.name || '—'}</p>
                                        <p><strong>Описание:</strong> {lesson.description}</p>
                                    </div>
                                ))}
                                {showMore && pastLessons.slice(3).map((lesson) => (
                                    <div key={lesson.id} className='flex flex-col m-5 p-5 gap-3 items-center justify-center border rounded-3xl w-3/12'>
                                        <p><strong>Дата:</strong> {new Date(lesson.date).toLocaleDateString('ru-RU', TimeOptions)}</p>
                                        <p><strong>Время:</strong> {TimeLessonS[lesson.numberLesson]}-{TimeLessonPo[lesson.numberLesson]}</p>
                                        <p><strong>Студент:</strong> {lesson.studentName}</p>
                                        <p><strong>Бизнес:</strong> {lesson.business?.name || '—'}</p>
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
                <div className='mt-10 border rounded-3xl'>
                    <div className='flex flex-col justify-center items-center'>
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
                                                setTelegramId(localUser.settings?.telegramId || '');
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
                {message && (
                    <div className={`mt-4 p-4 rounded-md ${message.includes('ошибка') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>
                )}
                <div className='mt-6'>
                    <h2 className='text-xl font-semibold mb-4'>Как получить ID мессенджера?</h2>
                    <div className='bg-gray-50 p-4 rounded-md'>
                        <ol className='list-decimal list-inside space-y-2 text-gray-600'>
                            <li>Откройте мессенджер и найдите бота @userinfobot</li>
                            <li>Отправьте боту любое сообщение</li>
                            <li>Бот ответит вам сообщением, содержащим ваш ID мессенджера</li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    );
} 