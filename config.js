import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

import prisma from './app/libs/prisma';

export const NextAuthOptions = {
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            credentials: {
                nickname: {},
                password: {},
            },

            async authorize(credentials) {
                try {
                    const user = await prisma.users.findFirst({
                        where: {
                            email: credentials.email,
                        },
                    });
                    if (!user) {
                        return null; // Если пользователь не найден, возвращаем null
                    }
                    const correctPassword = await compare(
                        credentials.password,
                        user.password
                    );
                    if (!correctPassword) {
                        return null; // Если пароль неверен, возвращаем null
                    }

                    // || user.role !== admin
                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('Error fetching user:', error);
                    return null; // В случае ошибки возвращаем null
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ token, session }) {
            session.user = {
                nickname: token.nickname,
                role: token.role,
                id: token.id,
            };
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
