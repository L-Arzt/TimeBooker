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
                specialistId: 1, // Предполагаем, что ID специалиста = 1 (админ)
                date: new Date(booking.date).toLocaleDateString('ru-RU'),
                time: `Занятие №${booking.numberLesson}`,
            });
            console.log('Уведомление об отмене бронирования отправлено');
        } catch (error) {
            console.error('Ошибка при отправке уведомления:', error);
        }

        redirect('/User/TimeTable');
    }

    return {
        message: 'Ошибка',
    };
} 