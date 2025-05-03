'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerUser } from './actions';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Form({ isAdmin }) {
    const router = useRouter();
    const [error, setError] = useState('');
    const [role, setRole] = useState('user');

    async function submitHandler(e) {
        e.preventDefault();
        setError('');

        const formData = new FormData(e.target);
        formData.append('role', isAdmin ? role : 'user');
        const response = await registerUser(formData);

        if (response.status === 'success') {
            await signIn('credentials', {
                email: formData.get('email'),
                password: formData.get('password'),
                redirect: false
            });
            router.push('/');
            router.refresh();
        } else {
            setError(response.message);
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <form 
                    onSubmit={submitHandler} 
                    className="bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-200 transition-all duration-300 hover:shadow-xl"
                >
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Регистрация</h2>
                        <p className="text-gray-500 mt-2">Создайте новый аккаунт</p>
                        {isAdmin && (
                            <p className="text-sm text-[#FF9100] mt-1">Режим администратора</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                                ФИО
                            </label>
                            <input
                                name="userName"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] outline-none transition-all duration-200"
                                placeholder="Ваше полное имя"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] outline-none transition-all duration-200"
                                placeholder="Ваш email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Пароль
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] outline-none transition-all duration-200"
                                placeholder="Ваш пароль"
                            />
                        </div>

                        {isAdmin && (
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Роль пользователя
                                </label>
                                <select
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF9100] focus:border-[#FF9100] outline-none transition-all duration-200"
                                >
                                    <option value="user">Ученик</option>
                                    <option value="admin">Администратор</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-medium text-center py-2 px-4 bg-red-50 rounded-lg transition-opacity duration-200">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="w-full py-3 px-4 bg-[#FF9100] hover:bg-[#FF9100]/90 text-white font-medium rounded-lg shadow-md transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:ring-opacity-50 flex items-center justify-center"
                    >Зарегистрироваться
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        Уже есть аккаунт?{' '}
                        <Link href="/login" className="text-[#FF9100] hover:text-[#FF9100]/80 font-medium transition-colors">
                            Войти
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}