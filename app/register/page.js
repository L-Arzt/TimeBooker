
import Form from './Form';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';

export default async function RegisterPage() {
    const session = await getServerSession(NextAuthOptions);
    const isAdmin = session?.user?.role === 'admin';

    return <Form isAdmin={isAdmin} />;
}