'use client';

import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import ProfileAdmin from '@/app/Admin/ProfileAdmin/ProfileAdmin';
import Profile from '@/app/User/Profile/Profile';

export default function BusinessProfilePage({ session, isAdmin = false, user, lessons }) {
    if (!session) {
        return <div>Загрузка...</div>;
    }

    if (isAdmin) {
        return <ProfileAdmin user={user} lessons={lessons} />;
    } else {
        return <Profile session={session} />;
    }
} 