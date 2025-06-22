import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import BusinessProfilePage from '@/app/components/BusinessProfilePage';

export default async function FitnessClubUserProfilePage() {
    const session = await getServerSession(NextAuthOptions);

    return <BusinessProfilePage session={session} isAdmin={false} />;
} 