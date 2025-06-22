import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Типы уведомлений
export const NotificationType = {
    // Уведомления для клиентов
    BOOKING_CREATED: 'BOOKING_CREATED',
    BOOKING_CANCELLED: 'BOOKING_CANCELLED',
    BOOKING_UPDATED: 'BOOKING_UPDATED',
    BOOKING_REMINDER_DAY: 'BOOKING_REMINDER_DAY',
    BOOKING_REMINDER_HOUR: 'BOOKING_REMINDER_HOUR',
    BOOKING_COMPLETED: 'BOOKING_COMPLETED',

    // Уведомления для специалистов
    SPECIALIST_NEW_BOOKING: 'SPECIALIST_NEW_BOOKING',
    SPECIALIST_BOOKING_CANCELLED: 'SPECIALIST_BOOKING_CANCELLED',
    SPECIALIST_BOOKING_UPDATED: 'SPECIALIST_BOOKING_UPDATED',
    SPECIALIST_SCHEDULE_UPDATED: 'SPECIALIST_SCHEDULE_UPDATED',
    SPECIALIST_SERVICES_UPDATED: 'SPECIALIST_SERVICES_UPDATED',

    // Уведомления для менеджеров
    MANAGER_NEW_BOOKING: 'MANAGER_NEW_BOOKING',
    MANAGER_BOOKING_CANCELLED: 'MANAGER_BOOKING_CANCELLED',
    MANAGER_BOOKING_UPDATED: 'MANAGER_BOOKING_UPDATED',
    MANAGER_SCHEDULE_UPDATED: 'MANAGER_SCHEDULE_UPDATED',
    MANAGER_SERVICES_UPDATED: 'MANAGER_SERVICES_UPDATED',
    MANAGER_LOW_LOAD: 'MANAGER_LOW_LOAD'
};

// Функция для отправки уведомления в Telegram
async function sendTelegramNotification(telegramId, message) {
    console.log('=== Telegram Notification Debug ===');
    console.log('1. Initial check:', {
        telegramId,
        hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
        tokenLength: process.env.TELEGRAM_BOT_TOKEN?.length,
        tokenStart: process.env.TELEGRAM_BOT_TOKEN?.substring(0, 5) + '...'
    });

    if (!telegramId) {
        console.log('❌ Telegram notification skipped: No telegramId provided');
        return;
    }

    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.log('❌ Telegram notification skipped: No TELEGRAM_BOT_TOKEN in environment variables');
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
        console.log('2. Sending request to:', url);

        const requestBody = {
            chat_id: telegramId,
            text: message,
            parse_mode: 'HTML'
        };
        console.log('3. Request body:', requestBody);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();
        console.log('4. Telegram API response:', responseData);

        if (!response.ok) {
            throw new Error(`Failed to send Telegram notification: ${JSON.stringify(responseData)}`);
        }

        console.log('✅ Telegram notification sent successfully');
    } catch (error) {
        console.error('❌ Error sending Telegram notification:', error);
        throw error;
    }
}

// Создание уведомления
export async function createNotification(userId, type, title, message) {
    try {
        console.log('=== Creating Notification ===');
        console.log('1. Input data:', { userId, type, title, message });

        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                isRead: false
            }
        });
        console.log('2. Notification created in database:', notification);

        // Получаем настройки пользователя
        const userSettings = await prisma.settings.findUnique({
            where: { userId }
        });
        console.log('3. User settings:', userSettings);

        // Отправляем уведомление в Telegram, если настроено
        if (userSettings?.telegramId) {
            console.log('4. Found telegramId, attempting to send notification');
            await sendTelegramNotification(userSettings.telegramId, message);
        } else {
            console.log('4. No telegramId found in user settings');
        }

        return notification;
    } catch (error) {
        console.error('❌ Error creating notification:', error);
        throw error;
    }
}

// Получение непрочитанных уведомлений
export async function getUnreadNotifications(userId) {
    try {
        return await prisma.notification.findMany({
            where: {
                userId,
                isRead: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (error) {
        console.error('Error getting unread notifications:', error);
        throw error;
    }
}

// Обновление настроек пользователя
export async function updateUserSettings(userId, settings) {
    try {
        return await prisma.userSettings.upsert({
            where: { userId },
            update: settings,
            create: {
                userId,
                ...settings
            }
        });
    } catch (error) {
        console.error('Error updating user settings:', error);
        throw error;
    }
}

// Функции для создания уведомлений при различных событиях

// Уведомления о бронировании
export async function notifyBookingCreated(booking) {
    const { userId, specialistId, date, time } = booking;

    // Уведомление для клиента
    await createNotification(
        userId,
        NotificationType.BOOKING_CREATED,
        'Новое бронирование',
        `Ваше бронирование на ${date} в ${time} успешно создано`
    );

    // Уведомление для специалиста
    await createNotification(
        specialistId,
        NotificationType.SPECIALIST_NEW_BOOKING,
        'Новое бронирование',
        `У вас новое бронирование на ${date} в ${time}`
    );

    // Уведомление для менеджера
    const manager = await prisma.users.findFirst({
        where: { role: 'MANAGER' }
    });
    if (manager) {
        await createNotification(
            manager.id,
            NotificationType.MANAGER_NEW_BOOKING,
            'Новое бронирование',
            `Создано новое бронирование на ${date} в ${time}`
        );
    }
}

// Уведомления об отмене бронирования
export async function notifyBookingCancelled(booking) {
    const { userId, specialistId, date, time } = booking;

    await createNotification(
        userId,
        NotificationType.BOOKING_CANCELLED,
        'Бронирование отменено',
        `Ваше бронирование на ${date} в ${time} было отменено`
    );

    await createNotification(
        specialistId,
        NotificationType.SPECIALIST_BOOKING_CANCELLED,
        'Бронирование отменено',
        `Бронирование на ${date} в ${time} было отменено`
    );

    const manager = await prisma.users.findFirst({
        where: { role: 'MANAGER' }
    });
    if (manager) {
        await createNotification(
            manager.id,
            NotificationType.MANAGER_BOOKING_CANCELLED,
            'Бронирование отменено',
            `Бронирование на ${date} в ${time} было отменено`
        );
    }
}

// Уведомления об изменении бронирования
export async function notifyBookingUpdated(booking) {
    const { userId, specialistId, date, time } = booking;

    await createNotification(
        userId,
        NotificationType.BOOKING_UPDATED,
        'Бронирование изменено',
        `Ваше бронирование изменено на ${date} в ${time}`
    );

    await createNotification(
        specialistId,
        NotificationType.SPECIALIST_BOOKING_UPDATED,
        'Бронирование изменено',
        `Бронирование изменено на ${date} в ${time}`
    );

    const manager = await prisma.users.findFirst({
        where: { role: 'MANAGER' }
    });
    if (manager) {
        await createNotification(
            manager.id,
            NotificationType.MANAGER_BOOKING_UPDATED,
            'Бронирование изменено',
            `Бронирование изменено на ${date} в ${time}`
        );
    }
}

// Напоминания о бронировании
export async function sendBookingReminders() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Получаем все бронирования на завтра
    const tomorrowBookings = await prisma.timetable.findMany({
        where: {
            date: tomorrow.toISOString().split('T')[0]
        },
        include: {
            user: true,
            specialist: true
        }
    });

    for (const booking of tomorrowBookings) {
        // Уведомление для клиента
        await createNotification(
            booking.userId,
            NotificationType.BOOKING_REMINDER_DAY,
            'Напоминание о бронировании',
            `Напоминаем, что завтра у вас запланировано бронирование на ${booking.time}`
        );

        // Уведомление для специалиста
        await createNotification(
            booking.specialistId,
            NotificationType.SPECIALIST_BOOKING_UPDATED,
            'Напоминание о бронировании',
            `Напоминаем, что завтра у вас запланировано бронирование на ${booking.time}`
        );
    }
}

// Уведомления об изменении расписания специалиста
export async function notifyScheduleUpdated(specialistId, date) {
    await createNotification(
        specialistId,
        NotificationType.SPECIALIST_SCHEDULE_UPDATED,
        'Изменение расписания',
        `Ваше расписание на ${date} было изменено`
    );

    const manager = await prisma.users.findFirst({
        where: { role: 'MANAGER' }
    });
    if (manager) {
        await createNotification(
            manager.id,
            NotificationType.MANAGER_SCHEDULE_UPDATED,
            'Изменение расписания',
            `Расписание специалиста на ${date} было изменено`
        );
    }
}

// Уведомления об изменении услуг
export async function notifyServicesUpdated(specialistId) {
    await createNotification(
        specialistId,
        NotificationType.SPECIALIST_SERVICES_UPDATED,
        'Изменение услуг',
        'Список ваших услуг был обновлен'
    );

    const manager = await prisma.users.findFirst({
        where: { role: 'MANAGER' }
    });
    if (manager) {
        await createNotification(
            manager.id,
            NotificationType.MANAGER_SERVICES_UPDATED,
            'Изменение услуг',
            'Список услуг специалиста был обновлен'
        );
    }
}

// Проверка загрузки специалистов
export async function checkSpecialistLoad() {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const specialists = await prisma.users.findMany({
        where: { role: 'SPECIALIST' }
    });

    for (const specialist of specialists) {
        const bookings = await prisma.timetable.count({
            where: {
                specialistId: specialist.id,
                date: {
                    gte: now.toISOString().split('T')[0],
                    lte: nextWeek.toISOString().split('T')[0]
                }
            }
        });

        if (bookings < 5) { // Если меньше 5 бронирований на неделю
            const manager = await prisma.users.findFirst({
                where: { role: 'MANAGER' }
            });
            if (manager) {
                await createNotification(
                    manager.id,
                    NotificationType.MANAGER_LOW_LOAD,
                    'Низкая загрузка специалиста',
                    `У специалиста ${specialist.name} низкая загрузка на следующую неделю (${bookings} бронирований)`
                );
            }
        }
    }
} 