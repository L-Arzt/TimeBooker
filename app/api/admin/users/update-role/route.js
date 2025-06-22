import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import prisma from '@/app/libs/prisma';

export async function POST(request) {
    try {
        const session = await getServerSession(NextAuthOptions);

        // Проверка авторизации
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Проверка роли - только админы могут изменять роли
        if (session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { userId, newRole } = await request.json();

        // Проверка обязательных полей
        if (!userId || !newRole) {
            return NextResponse.json(
                { error: 'ID пользователя и новая роль обязательны' },
                { status: 400 }
            );
        }

        // Проверка существования пользователя
        const user = await prisma.users.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Пользователь не найден' },
                { status: 404 }
            );
        }

        // Обновление роли пользователя
        const updatedUser = await prisma.users.update({
            where: { id: parseInt(userId) },
            data: { role: newRole },
            select: {
                id: true,
                email: true,
                userName: true,
                role: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 