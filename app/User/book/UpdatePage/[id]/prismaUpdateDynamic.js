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
            // Получаем бизнес и владельца
            let business = null;
            if (updatedLesson.businessId) {
                business = await prisma.business.findUnique({ where: { id: updatedLesson.businessId } });
            }
            let specialistId = null;
            if (business && business.ownerId) {
                specialistId = business.ownerId;
            }
            const admins = await prisma.users.findMany({ where: { role: 'admin' } });
            await notifyBookingUpdated({
                userId: userId,
                specialistId: specialistId,
                date: new Date(data.date).toLocaleDateString('ru-RU'),
                time: `Занятие №${data.lessonNum}`,
                adminIds: admins.map(a => a.id),
            });
            console.log('Уведомление об обновлении бронирования отправлено');
        } catch (error) {
            console.error('Ошибка при отправке уведомления:', error);
        }
        return { redirectTo: `/business/${data.slug}/user/timetable` };
    }
    return {
        message: 'Ошибка',
    };
} 