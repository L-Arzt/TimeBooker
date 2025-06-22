import { NextResponse } from 'next/server';
import { sendBookingReminders, checkSpecialistLoad } from '@/app/libs/notificationService';

export async function POST(request) {
    try {
        // Проверяем секретный ключ для безопасности
        const { secret } = await request.json();
        if (secret !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Отправляем напоминания о бронированиях
        await sendBookingReminders();

        // Проверяем загрузку специалистов
        await checkSpecialistLoad();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending reminders:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 