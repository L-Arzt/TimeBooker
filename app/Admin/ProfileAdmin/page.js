import { getAdminSessionAndUser } from '@/app/libs/getAdminSessionProfile';
import ProfileAdmin from './ProfileAdmin';

export default async function Page() {
    const { user, lessons } = await getAdminSessionAndUser();

    return (
        <ProfileAdmin user={user} lessons={lessons} />
    );
}