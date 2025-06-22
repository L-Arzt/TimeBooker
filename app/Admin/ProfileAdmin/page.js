import ProfileAdmin from './ProfileAdmin';
import { notFound } from 'next/navigation';
import { getAdminSessionAndUser } from '@/app/libs/getAdminSessionProfile';
import Link from 'next/link';

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