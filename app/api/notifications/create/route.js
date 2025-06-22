import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import { PrismaClient } from '@prisma/client';
import { createNotification } from '@/app/libs/notificationService';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const session = await getServerSession(NextAuthOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, type, title, message } = await request.json();

        // Проверяем, что пользователь имеет право создавать уведомления
        const user = await prisma.users.findUnique({
            where: { id: session.user.id }
        });

        if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const notification = await createNotification(userId, type, title, message);

        return NextResponse.json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 