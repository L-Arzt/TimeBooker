'use server';

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import { notifyBookingCreated } from '@/app/libs/notificationService';

const prisma = new PrismaClient();

export async function createLesson(prevState, formData) {
    const data = Object.fromEntries(formData);

    // Получаем сессию
    const session = await getServerSession(NextAuthOptions);

    if (!session) {
        return {
            message: 'Необходимо войти в систему',
        };
    }

    const userId = session.user.id;

    const slug = data.slug;
    let business = null;
    if (slug) {
        business = await prisma.business.findUnique({ where: { slug } });
    }
    const lesson = await prisma.timetable.findFirst({
        where: {
            date: new Date(data.date),
            numberLesson: Number(data.lessonNum),
            weekDay: Number(data.lessonDay),
            businessId: business ? business.id : null,
        },
    });

    console.log(lesson);

    if (lesson) {
        return {
            message: 'Уже занято',
        };
    }

    const createLesson = await prisma.timetable.create({
        data: {
            numberLesson: Number(data.lessonNum),
            weekDay: Number(data.lessonDay),
            studentName: data.studentName,
            description: data.description,
            date: new Date(data.date),
            typeLearning: data.typeLearning,
            booked: true,
            userId: userId,
            businessId: business ? business.id : null,
        },
    });

    if (createLesson) {
        // Отправляем уведомление о создании бронирования
        try {
            console.log('Отправка уведомления о создании бронирования');
            // Получаем владельца бизнеса (specialistId)
            let specialistId = null;
            if (business && business.ownerId) {
                specialistId = business.ownerId;
            }
            // Получаем всех админов
            const admins = await prisma.users.findMany({ where: { role: 'admin' } });
            await notifyBookingCreated({
                userId: userId,
                specialistId: specialistId,
                date: new Date(data.date).toLocaleDateString('ru-RU'),
                time: `Занятие №${data.lessonNum}`,
                adminIds: admins.map(a => a.id),
            });
            console.log('Уведомление о создании бронирования отправлено');
        } catch (error) {
            console.error('Ошибка при отправке уведомления:', error);
        }
        return { redirectTo: `/business/${data.slug}/user/timetable` };
    }
    return {
        message: 'Ошибка',
    };
} 