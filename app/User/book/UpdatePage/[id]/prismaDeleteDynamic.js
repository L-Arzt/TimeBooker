'use server';

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { notifyBookingCancelled } from '@/app/libs/notificationService';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';

const prisma = new PrismaClient();

export async function deleteLesson(params) {
    console.log({ params });

    // Получаем сессию для определения текущего пользователя
    const session = await getServerSession(NextAuthOptions);

    if (!session) {
        return {
            message: 'Необходимо войти в систему',
        };
    }

    // Получаем данные о бронировании перед удалением
    const booking = await prisma.timetable.findUnique({
        where: {
            id: Number(params),
        }
    });

    if (!booking) {
        return {
            message: 'Бронирование не найдено',
        };
    }

    // Получаем бизнес и владельца
    let business = null;
    if (booking.businessId) {
        business = await prisma.business.findUnique({ where: { id: booking.businessId } });
    }
    let specialistId = null;
    if (business && business.ownerId) {
        specialistId = business.ownerId;
    }
    const admins = await prisma.users.findMany({ where: { role: 'admin' } });

    const deleteLesson = await prisma.timetable.delete({
        where: {
            id: Number(params),
        },
    });

    if (deleteLesson) {
        // Отправляем уведомление об отмене бронирования
        try {
            console.log('Отправка уведомления об отмене бронирования');
            await notifyBookingCancelled({
                userId: session.user.id,
                specialistId: specialistId,
                date: new Date(booking.date).toLocaleDateString('ru-RU'),
                time: `Занятие №${booking.numberLesson}`,
                adminIds: admins.map(a => a.id),
            });
            console.log('Уведомление об отмене бронирования отправлено');
        } catch (error) {
            console.error('Ошибка при отправке уведомления:', error);
        }
        return { redirectTo: `/business/${params.slug}/user/timetable` };
    }

    return {
        message: 'Ошибка',
    };
} 