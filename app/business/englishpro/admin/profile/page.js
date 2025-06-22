import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import ProfileAdmin from '@/app/Admin/ProfileAdmin/ProfileAdmin';
import prisma from '@/app/libs/prisma';

export default async function ProfileAdminPage() {
    const session = await getServerSession(NextAuthOptions);

    if (!session) {
        return null;
    }

    const user = await prisma.users.findUnique({
        where: {
            id: session.user.id
        }
    });

    const lessons = await prisma.timetable.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: {
            date: 'asc'
        }
    });

    return <ProfileAdmin user={user} lessons={lessons} />;
} 