"use server";
import prisma from '@/app/libs/prisma';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';

export async function updateLesson(prevState, formData) {
    try {
        const session = await getServerSession(NextAuthOptions);
        if (!session) {
            return { message: 'Необходимо войти в систему' };
        }
        const userId = session.user.id;
        const updatedLesson = await prisma.timetable.update({
            where: { id: Number(formData.get('id')) },
            data: {
                studentName: formData.get('studentName'),
                description: formData.get('description'),
                typeLearning: formData.get('typeLearning'),
                numberLesson: Number(formData.get('lessonNum')),
                weekDay: Number(formData.get('lessonDay')),
                date: new Date(formData.get('date')),
                userId: userId,
            },
        });
        if (updatedLesson) {
            // Отправляем уведомления
            let business = null;
            if (updatedLesson.businessId) {
                business = await prisma.business.findUnique({ where: { id: updatedLesson.businessId } });
            }
            let specialistId = null;
            if (business && business.ownerId) {
                specialistId = business.ownerId;
            }
            const admins = await prisma.users.findMany({ where: { role: 'admin' } });
            await import('@/app/libs/notificationService').then(({ notifyBookingUpdated }) =>
                notifyBookingUpdated({
                    userId,
                    specialistId,
                    date: new Date(formData.get('date')).toLocaleDateString('ru-RU'),
                    time: `Занятие №${formData.get('lessonNum')}`,
                    adminIds: admins.map(a => a.id),
                })
            );
            return { redirectTo: `/business/${formData.get('slug')}/user/timetable` };
        }
        return { message: 'Ошибка при обновлении бронирования.' };
    } catch (error) {
        return { message: 'Ошибка при обновлении бронирования: ' + (error?.message || error?.toString() || 'Unknown error') };
    }
}

export async function getLessonById(id) {
    return prisma.timetable.findUnique({ where: { id: Number(id) } });
} 