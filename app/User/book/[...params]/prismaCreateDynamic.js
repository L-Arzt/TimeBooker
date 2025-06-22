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

    const lesson = await prisma.timetable.findFirst({
        where: {
            date: new Date(data.date),
            numberLesson: Number(data.lessonNum),
            // weekDay: Number(data.lessonDay), // если нужно
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
        },
    });

    if (createLesson) {
        // Отправляем уведомление о создании бронирования
        try {
            console.log('Отправка уведомления о создании бронирования');
            await notifyBookingCreated({
                userId: userId,
                specialistId: 1, // Предполагаем, что ID специалиста = 1 (админ)
                date: new Date(data.date).toLocaleDateString('ru-RU'),
                time: `Занятие №${data.lessonNum}`,
            });
            console.log('Уведомление о создании бронирования отправлено');
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