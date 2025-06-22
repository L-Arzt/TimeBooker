'use server';

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { notifyBookingUpdated } from '@/app/libs/notificationService';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';

const prisma = new PrismaClient();

export async function updateLesson(prevState, formData) {
    const data = Object.fromEntries(formData);

    // Получаем сессию для определения текущего пользователя
    const session = await getServerSession(NextAuthOptions);

    if (!session) {
        return {
            message: 'Необходимо войти в систему',
        };
    }

    const userId = session.user.id;

    const updatedLesson = await prisma.timetable.update({
        where: {
            id: Number(data.id),
        },
        data: {
            numberLesson: Number(data.lessonNum),
            weekDay: Number(data.lessonDay),
            studentName: data.studentName,
            description: data.description,
            date: new Date(data.date),
            typeLearning: data.typeLearning,
            booked: true,
            userId: userId,
        },
    });

    if (updatedLesson) {
        // Отправляем уведомление об обновлении бронирования
        try {
            console.log('Отправка уведомления об обновлении бронирования');
            await notifyBookingUpdated({
                userId: userId,
                specialistId: 1, // Предполагаем, что ID специалиста = 1 (админ)
                date: new Date(data.date).toLocaleDateString('ru-RU'),
                time: `Занятие №${data.lessonNum}`,
            });
            console.log('Уведомление об обновлении бронирования отправлено');
        } catch (error) {
            console.error('Ошибка при отправке уведомления:', error);
        }

        redirect('/User/TimeTable');
        return {
            message: 'Готово',
        };
    }
    return {
        message: 'Ошибка',
    };
} 