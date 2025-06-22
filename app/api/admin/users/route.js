import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import prisma from '@/app/libs/prisma';

export async function GET(request) {
    try {
        const session = await getServerSession(NextAuthOptions);

        // Проверка авторизации
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Проверка роли - только админы могут получить список пользователей
        if (session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Получаем всех пользователей
        const users = await prisma.users.findMany({
            select: {
                id: true,
                email: true,
                userName: true,
                role: true,
            },
            orderBy: {
                id: 'asc',
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 