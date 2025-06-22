import { NextAuthOptions } from '@/config';
import { getServerSession } from 'next-auth';
import prisma from '@/app/libs/prisma';

export async function getAdminSessionAndUser(slug) {
    const session = await getServerSession(NextAuthOptions);

    if (!session) {
        return { session: null, user: null, lessons: [] };
    }

    const user = await prisma.users.findFirst({
        where: {
            id: session.user.id,
        },
        include: {
            businesses: true,
        },
    });

    console.log('DEBUG user:', JSON.stringify(user, null, 2));

    let lessons;
    if (user.role === 'business') {
        // Показываем только занятия его бизнеса
        const businessIds = user.businesses.map(b => b.id);
        lessons = await prisma.timetable.findMany({
            where: {
                businessId: { in: businessIds },
            },
            orderBy: { date: 'asc' },
            include: { business: true },
        });
    } else {
        // Для других ролей — все занятия
        lessons = await prisma.timetable.findMany({
            orderBy: { date: 'asc' },
            include: { business: true },
        });
    }

    return { user, lessons };
}
