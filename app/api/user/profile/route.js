import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import prisma from '@/app/libs/prisma';

export async function GET() {
    try {
        const session = await getServerSession(NextAuthOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.users.findUnique({
            where: { id: session.user.id },
            include: {
                timetables: {
                    include: { business: true }
                },
                settings: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Добавляем telegramId из настроек
        const userData = {
            ...user,
            telegramId: user.settings?.telegramId || ''
        };

        return NextResponse.json(userData);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 