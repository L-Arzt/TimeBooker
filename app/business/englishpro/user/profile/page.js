import { getServerSession } from 'next-auth';
import Profile from '@/app/User/Profile/Profile';

export default async function ProfilePage() {
    const session = await getServerSession();

    return (
        <Profile session={session} />
    );
} 