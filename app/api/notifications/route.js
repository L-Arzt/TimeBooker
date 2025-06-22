import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/app/libs/prisma';
import { NextAuthOptions } from '@/config';

// GET /api/notifications - получение уведомлений пользователя
export async function GET() {
    try {
        const session = await getServerSession(NextAuthOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// PUT /api/notifications - отметка уведомления как прочитанного
export async function PUT(request) {
    try {
        const session = await getServerSession(NextAuthOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { notificationId } = await request.json();

        const updatedNotification = await prisma.notification.update({
            where: {
                id: notificationId,
                userId: session.user.id,
            },
            data: {
                isRead: true,
            },
        });

        return NextResponse.json(updatedNotification);
    } catch (error) {
        console.error('Error updating notification:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 