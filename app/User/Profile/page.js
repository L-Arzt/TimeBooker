import { getSessionAndUser } from '@/app/libs/getSessionProfile';
import Profile from './Profile';

export default async function Page() {
  const { user, lessons } = await getSessionAndUser();

  return (
    <Profile user={user} lessons={lessons} />
  );
}
