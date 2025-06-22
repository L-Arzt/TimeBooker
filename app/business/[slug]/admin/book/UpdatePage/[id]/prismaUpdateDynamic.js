"use server";
import prisma from '@/app/libs/prisma';
import { redirect } from 'next/navigation';

export async function updateLesson(prevState, formData) {
    try {
        const lesson = await prisma.timetable.update({
            where: { id: Number(formData.get('id')) },
            data: {
                studentName: formData.get('studentName'),
                description: formData.get('description'),
                typeLearning: formData.get('typeLearning'),
                numberLesson: Number(formData.get('lessonNum')),
                weekDay: Number(formData.get('lessonDay')),
                date: formData.get('date'),
                // Добавьте slug, если нужно связать с бизнесом
            },
        });
        if (lesson) {
            // Отправляем уведомления
            let business = null;
            if (lesson.businessId) {
                business = await prisma.business.findUnique({ where: { id: lesson.businessId } });
            }
            let specialistId = null;
            if (business && business.ownerId) {
                specialistId = business.ownerId;
            }
            const admins = await prisma.users.findMany({ where: { role: 'admin' } });
            await import('@/app/libs/notificationService').then(({ notifyBookingUpdated }) =>
                notifyBookingUpdated({
                    userId: null, // админ обновляет, можно передать null или id
                    specialistId,
                    date: new Date(formData.get('date')).toLocaleDateString('ru-RU'),
                    time: `Занятие №${formData.get('lessonNum')}`,
                    adminIds: admins.map(a => a.id),
                })
            );
            return { redirectTo: `/business/${formData.get('slug')}/admin/timetable` };
        }
        return { message: 'Бронирование успешно обновлено!' };
    } catch (error) {
        return { message: 'Ошибка при обновлении бронирования: ' + (error?.message || error?.toString() || 'Unknown error') };
    }
}

export async function getLessonById(id) {
    return prisma.timetable.findUnique({ where: { id: Number(id) } });
} 