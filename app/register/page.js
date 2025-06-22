import Form from './Form';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
    const session = await getServerSession(NextAuthOptions);

    // Проверяем, является ли пользователь администратором
    const isAdmin = session?.user?.role === 'admin';

    // Если пользователь уже авторизован и не является администратором, перенаправляем на главную
    if (session && !isAdmin) {
        redirect('/');
    }

    return <Form isAdmin={isAdmin} />;
}