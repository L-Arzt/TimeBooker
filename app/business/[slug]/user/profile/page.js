import Profile from './Profile.jsx';
import { notFound } from 'next/navigation';
import { getSessionAndUser } from '@/app/libs/getSessionProfile';

export default async function UserProfilePage({ params }) {
    const { user, lessons } = await getSessionAndUser();
    if (!user) return notFound();
    return <Profile user={user} lessons={lessons} />;
} 