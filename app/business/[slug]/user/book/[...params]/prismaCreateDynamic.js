"use server";
import prisma from '@/app/libs/prisma';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import { notifyBookingCreated } from '@/app/libs/notificationService';

export async function createLesson(prevState, formData) {
    try {
        const session = await getServerSession(NextAuthOptions);
        if (!session) {
            return { message: 'Необходимо войти в систему' };
        }
        const userId = session.user.id;
        const slug = formData.get('slug');
        let business = null;
        if (slug) {
            business = await prisma.business.findUnique({ where: { slug } });
        }
        const lesson = await prisma.timetable.create({
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
        if (lesson) {
            // Отправляем уведомления
            let specialistId = null;
            if (business && business.ownerId) {
                specialistId = business.ownerId;
            }
            const admins = await prisma.users.findMany({ where: { role: 'admin' } });
            await notifyBookingCreated({
                userId,
                specialistId,
                date: new Date(formData.get('date')).toLocaleDateString('ru-RU'),
                time: `Занятие №${formData.get('lessonNum')}`,
                adminIds: admins.map(a => a.id),
            });
            return { redirectTo: `/business/${formData.get('slug')}/user/timetable` };
        }
        return { message: 'Ошибка при создании бронирования.' };
    } catch (error) {
        return { message: 'Ошибка при создании бронирования: ' + (error?.message || error?.toString() || 'Unknown error') };
    }
} 