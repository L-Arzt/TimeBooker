import { NextAuthOptions } from '@/config';
import { getServerSession } from 'next-auth';
import prisma from '@/app/libs/prisma';

export async function getAdminSessionAndUser() {
    const session = await getServerSession(NextAuthOptions);

    if (!session) {
        return { session: null, user: null, lessons: [] };
    }

    const user = await prisma.users.findFirst({
        where: {
            id: session.user.id,
        },
    });

    const lessons = await prisma.timetable.findMany({
        where: {
            booked: true,
        },
        orderBy: {
            userId: 'asc',
        },
    });

    return { user, lessons };
}
