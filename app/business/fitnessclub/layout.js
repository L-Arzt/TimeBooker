import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import BusinessLayout from '@/app/components/BusinessLayout';

// Данные о бизнесе
const businessData = {
    name: 'FitnessClub',
    type: 'Фитнес-центр',
    slug: 'fitnessclub'
};

export default async function FitnessClubLayout({ children }) {
    const session = await getServerSession(NextAuthOptions);

    return (
        <BusinessLayout
            businessData={businessData}
            session={session}
        >
            {children}
        </BusinessLayout>
    );
} 