import NextAuth from 'next-auth/next';

import { NextAuthOptions } from '@/config';

const handler = NextAuth(NextAuthOptions);

export { handler as GET, handler as POST };
