import { NextResponse } from 'next/server';
import { createNotification, NotificationType } from '@/app/libs/notificationService';

const testNotifications = {
    user: {
        type: NotificationType.BOOKING_CREATED,
        title: 'Тест: Новое бронирование',
        message: 'Тест: Ваше бронирование успешно создано',
    },
    admin: {
        type: NotificationType.MANAGER_NEW_BOOKING,
        title: 'Тест: Новое бронирование (админ)',
        message: 'Тест: Для администратора: создано новое бронирование',
    },
    business: {
        type: NotificationType.SPECIALIST_NEW_BOOKING,
        title: 'Тест: Новое бронирование (бизнес)',
        message: 'Тест: Для владельца бизнеса: новое бронирование',
    },
};

export async function POST(request) {
    try {
        const { userId, type } = await request.json();
        if (!userId || !type || !testNotifications[type]) {
            return NextResponse.json({ error: 'Некорректные параметры' }, { status: 400 });
        }
        const notif = testNotifications[type];
        const notification = await createNotification(
            userId,
            notif.type,
            notif.title,
            notif.message
        );
        return NextResponse.json({ success: true, notification });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
