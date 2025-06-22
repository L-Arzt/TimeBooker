import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import BusinessProfilePage from '@/app/components/BusinessProfilePage';
import prisma from '@/app/libs/prisma';

export default async function FitnessClubAdminProfilePage() {
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
            userId: session.user.id,
            business: {
                slug: 'fitnessclub'
            }
        },
        orderBy: {
            date: 'asc'
        }
    });

    return <BusinessProfilePage session={session} isAdmin={true} user={user} lessons={lessons} />;
} 