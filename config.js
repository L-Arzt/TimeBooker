import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from './app/libs/prisma';

export const NextAuthOptions = {
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await prisma.users.findFirst({
                        where: {
                            email: credentials.email,
                        },
                    });

                    if (!user) {
                        return null;
                    }

                    const correctPassword = await compare(
                        credentials.password,
                        user.password
                    );

                    if (!correctPassword) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        userName: user.userName,
                        role: user.role,
                    };
                } catch (error) {
                    console.error('Error in authorize:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.email = user.email;
                token.userName = user.userName;
            }
            return token;
        },
        async session({ token, session }) {
            if (token) {
                session.user = {
                    id: token.id,
                    email: token.email,
                    userName: token.userName,
                    role: token.role,
                };
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};