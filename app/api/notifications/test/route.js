import { NextResponse } from 'next/server';
import { createNotification, NotificationType } from '@/app/libs/notificationService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testNotifications = [
    {
        type: NotificationType.BOOKING_CREATED,
        title: 'Новое бронирование',
        message: 'Тест: Ваше бронирование успешно создано',
    },
    {
        type: NotificationType.BOOKING_CANCELLED,
        title: 'Бронирование отменено',
        message: 'Тест: Ваше бронирование было отменено',
    },
    {
        type: NotificationType.BOOKING_UPDATED,
        title: 'Бронирование изменено',
        message: 'Тест: Ваше бронирование изменено',
    },
    {
        type: NotificationType.BOOKING_REMINDER_DAY,
        title: 'Напоминание о бронировании',
        message: 'Тест: Напоминаем о завтрашнем бронировании',
    },
    {
        type: NotificationType.SPECIALIST_SCHEDULE_UPDATED,
        title: 'Изменение расписания',
        message: 'Тест: Ваше расписание было изменено',
    },
    {
        type: NotificationType.SPECIALIST_SERVICES_UPDATED,
        title: 'Изменение услуг',
        message: 'Тест: Список ваших услуг был обновлён',
    },
    {
        type: NotificationType.MANAGER_LOW_LOAD,
        title: 'Низкая загрузка специалиста',
        message: 'Тест: У специалиста низкая загрузка на следующую неделю',
    },
];

export async function POST(request) {
    try {
        // Находим первого пользователя с заполненным telegramId
        const userWithTelegram = await prisma.settings.findFirst({
            where: {
                telegramId: { not: null },
            },
            include: { user: true },
        });

        if (!userWithTelegram || !userWithTelegram.userId) {
            return NextResponse.json({ error: 'Нет пользователя с telegramId' }, { status: 404 });
        }

        const results = [];
        for (const notif of testNotifications) {
            const notification = await createNotification(
                userWithTelegram.userId,
                notif.type,
                notif.title,
                notif.message
            );
            results.push({ type: notif.type, notification });
        }

        return NextResponse.json({ success: true, userId: userWithTelegram.userId, results });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
