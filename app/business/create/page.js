'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateBusinessPage() {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        type: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    // Проверяем доступ - только admin может создавать бизнесы
    if (session?.user?.role !== 'admin') {
        return (
            <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-red-600">Доступ запрещен</h1>
                <p>Только администраторы платформы могут создавать новые бизнесы.</p>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Автоматически генерируем slug из названия
        if (name === 'name') {
            setFormData({
                ...formData,
                name: value,
                slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/business/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    ownerId: session.user.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при создании бизнеса');
            }

            const data = await response.json();
            router.push(`/business/${data.slug}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Создание нового бизнеса</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Название бизнеса</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">URL (slug)</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Ваш бизнес будет доступен по адресу: /business/{formData.slug}
                    </p>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Тип бизнеса</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Например: Школа английского языка"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Описание</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        rows="4"
                        placeholder="Краткое описание бизнеса"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-[#FF9100] text-white py-2 px-4 rounded-md hover:bg-[#E67E00] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Создание...' : 'Создать бизнес'}
                </button>
            </form>
        </div>
    );
} 