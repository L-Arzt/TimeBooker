"use server";
import prisma from '@/app/libs/prisma';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';

export async function deleteLesson({ id, slug }) {
    try {
        const session = await getServerSession(NextAuthOptions);
        if (!session) {
            return { message: 'Необходимо войти в систему' };
        }
        await prisma.timetable.delete({ where: { id: Number(id) } });
        // Получаем бизнес и владельца
        let business = null;
        if (slug) {
            business = await prisma.business.findUnique({ where: { slug } });
        }
        let specialistId = null;
        if (business && business.ownerId) {
            specialistId = business.ownerId;
        }
        const admins = await prisma.users.findMany({ where: { role: 'admin' } });
        await import('@/app/libs/notificationService').then(({ notifyBookingCancelled }) =>
            notifyBookingCancelled({
                userId: session.user.id,
                specialistId,
                date: new Date().toLocaleDateString('ru-RU'),
                time: 'Удалено бронирование',
                adminIds: admins.map(a => a.id),
            })
        );
        return { redirectTo: `/business/${slug}/user/timetable` };
    } catch (error) {
        return { message: 'Ошибка при удалении бронирования: ' + (error?.message || error?.toString() || 'Unknown error') };
    }
} 