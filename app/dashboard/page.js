'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
    const [businesses, setBusinesses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Проверка авторизации и роли
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated' && session.user.role !== 'admin') {
            router.push('/');
            return;
        }

        // Загрузка списка бизнесов
        if (status === 'authenticated') {
            const fetchBusinesses = async () => {
                try {
                    // Загрузка бизнесов из API
                    const response = await fetch('/api/business/list');

                    if (!response.ok) {
                        throw new Error('Ошибка при загрузке бизнесов');
                    }

                    const data = await response.json();
                    setBusinesses(data);
                    setIsLoading(false);
                } catch (err) {
                    console.error('Error fetching businesses:', err);

                    // Если API не работает, используем моковые данные
                    const mockData = [
                        { id: 1, name: 'EnglishPro', slug: 'englishpro', type: 'Школа английского языка', createdAt: '2023-06-15' },
                        { id: 2, name: 'FitnessClub', slug: 'fitnessclub', type: 'Фитнес-клуб', createdAt: '2023-07-20' },
                    ];

                    setBusinesses(mockData);
                    setError('Используются тестовые данные. API недоступно.');
                    setIsLoading(false);
                }
            };

            fetchBusinesses();
        }
    }, [status, session, router]);

    const handleSeedBusinesses = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/business/seed');

            if (!response.ok) {
                throw new Error('Ошибка при добавлении тестовых бизнесов');
            }

            const result = await response.json();
            alert(`Бизнесы добавлены: ${JSON.stringify(result.results)}`);

            // Перезагружаем список бизнесов
            const businessesResponse = await fetch('/api/business/list');
            if (businessesResponse.ok) {
                const data = await businessesResponse.json();
                setBusinesses(data);
            }

            setIsLoading(false);
        } catch (err) {
            console.error('Error seeding businesses:', err);
            setError('Ошибка при добавлении тестовых бизнесов');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Панель управления</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Бизнесы на платформе</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSeedBusinesses}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Добавить тестовые бизнесы
                        </button>
                        <Link
                            href="/business/create"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Создать новый бизнес
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Название
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Тип
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Дата создания
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {businesses.length > 0 ? (
                                businesses.map((business) => (
                                    <tr key={business.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {business.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {business.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                /{business.slug}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {business.type || 'Не указан'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(business.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                href={`/business/${business.slug}`}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Просмотр
                                            </Link>
                                            <Link
                                                href={`/business/${business.slug}/admin/timetable`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Управление
                                            </Link>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => alert(`Удаление бизнеса ${business.name} (в реальном приложении)`)}
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Нет доступных бизнесов. Создайте новый бизнес, чтобы начать.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Статистика платформы</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Всего бизнесов:</span>
                            <span className="font-semibold">{businesses.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Активных пользователей:</span>
                            <span className="font-semibold">42</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Бронирований за месяц:</span>
                            <span className="font-semibold">156</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Последние действия</h3>
                    <ul className="space-y-2">
                        <li className="text-sm text-gray-600">
                            <span className="text-gray-400">12:30</span> Создан новый бизнес "FitnessClub"
                        </li>
                        <li className="text-sm text-gray-600">
                            <span className="text-gray-400">10:15</span> Обновлены настройки "EnglishPro"
                        </li>
                        <li className="text-sm text-gray-600">
                            <span className="text-gray-400">Вчера</span> Добавлено 5 новых пользователей
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">Быстрые действия</h3>
                    <div className="space-y-2">
                        <Link
                            href="/business/create"
                            className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Создать бизнес
                        </Link>
                        <button
                            className="block w-full text-center bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200"
                            onClick={() => alert('Функция в разработке')}
                        >
                            Отчеты
                        </button>
                        <button
                            className="block w-full text-center bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200"
                            onClick={() => alert('Функция в разработке')}
                        >
                            Настройки платформы
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 