"use server";
import prisma from '@/app/libs/prisma';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import { redirect } from 'next/navigation';

export async function createLesson(prevState, formData) {
    try {
        const session = await getServerSession(NextAuthOptions);
        if (!session) {
            return { message: 'Необходимо войти в систему' };
        }
        const userId = session.user.id;
        // Получаем бизнес по slug
        const slug = formData.get('slug');
        let business = null;
        if (slug) {
            business = await prisma.business.findUnique({ where: { slug } });
        }
        const lesson = await prisma.timetable.findFirst({
            where: {
                date: new Date(formData.get('date')),
                numberLesson: Number(formData.get('lessonNum')),
                weekDay: Number(formData.get('lessonDay')),
                businessId: business ? business.id : null,
            },
        });
        if (lesson) {
            return { message: 'Уже занято' };
        }
        const lessonCreated = await prisma.timetable.create({
            data: {
                studentName: formData.get('studentName'),
                description: formData.get('description'),
                typeLearning: formData.get('typeLearning'),
                numberLesson: Number(formData.get('lessonNum')),
                weekDay: Number(formData.get('lessonDay')),
                date: new Date(formData.get('date')),
                userId: userId,
                businessId: business ? business.id : null,
            },
        });
        if (lessonCreated) {
            // Отправляем уведомления
            let specialistId = null;
            if (business && business.ownerId) {
                specialistId = business.ownerId;
            }
            const admins = await prisma.users.findMany({ where: { role: 'admin' } });
            await import('@/app/libs/notificationService').then(({ notifyBookingCreated }) =>
                notifyBookingCreated({
                    userId,
                    specialistId,
                    date: new Date(formData.get('date')).toLocaleDateString('ru-RU'),
                    time: `Занятие №${formData.get('lessonNum')}`,
                    adminIds: admins.map(a => a.id),
                })
            );
            return { redirectTo: `/business/${formData.get('slug')}/admin/timetable` };
        }
        return { message: 'Бронирование успешно создано!' };
    } catch (error) {
        return { message: 'Ошибка при создании бронирования: ' + (error?.message || error?.toString() || 'Unknown error') };
    }
} 