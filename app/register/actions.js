'use server';

import prisma from '@/app/libs/prisma';
import { hash } from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';

export async function registerUser(formData) {
    const { userName, email, password, role } = Object.fromEntries(formData);

    // Получаем текущую сессию для проверки прав
    const session = await getServerSession(NextAuthOptions);

    // Проверяем права на создание пользователей с определенными ролями
    const requestedRole = role || 'user';
    const isAdmin = session?.user?.role === 'admin';

    // Только админы могут создавать других админов и бизнес-аккаунты
    if ((requestedRole === 'admin' || requestedRole === 'business') && !isAdmin) {
        return {
            status: 'error',
            message: 'У вас нет прав для создания пользователя с такой ролью'
        };
    }

    try {
        const hashedPassword = await hash(password, 10);
        const user = await prisma.users.create({
            data: {
                userName,
                email,
                password: hashedPassword,
                role: requestedRole,
            },
        });

        return { status: 'success', message: 'Пользователь успешно создан' };
    } catch (error) {
        console.error(error);
        return { status: 'error', message: 'Аккаунт с такой почтой или никнеймом уже зарегистрирован' };
    }
}
