import { getServerSession } from 'next-auth';
import Profile from './Profile';

export default async function Page() {
  const session = await getServerSession();

  return (
    <Profile session={session} />
  );
}
