import ProfileAdmin from './ProfileAdmin.jsx';
import { notFound } from 'next/navigation';
import { getAdminSessionAndUser } from '@/app/libs/getAdminSessionProfile';

export default async function AdminProfilePage({ params }) {
    const { slug } = params;
    const { user, lessons } = await getAdminSessionAndUser(slug);
    if (!user) return notFound();
    return <ProfileAdmin user={user} lessons={lessons} />;
} 