"use server";
import prisma from '@/app/libs/prisma';

export async function deleteLesson({ id, slug }) {
    try {
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
                userId: null, // админ удаляет, можно передать null или id удаляющего
                specialistId,
                date: new Date().toLocaleDateString('ru-RU'),
                time: 'Удалено бронирование',
                adminIds: admins.map(a => a.id),
            })
        );
        return { redirectTo: `/business/${slug}/admin/timetable` };
    } catch (error) {
        return { message: 'Ошибка при удалении бронирования.' };
    }
} 