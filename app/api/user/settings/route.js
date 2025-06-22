import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request) {
    try {
        const session = await getServerSession(NextAuthOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { telegramId } = await request.json();

        // Обновляем или создаем настройки пользователя
        const settings = await prisma.settings.upsert({
            where: {
                userId: session.user.id
            },
            update: {
                telegramId
            },
            create: {
                userId: session.user.id,
                telegramId
            }
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error updating user settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 