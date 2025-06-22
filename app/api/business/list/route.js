import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import prisma from '@/app/libs/prisma';

export async function GET(request) {
    try {
        const session = await getServerSession(NextAuthOptions);

        // Проверка авторизации
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Получаем все бизнесы
        const businesses = await prisma.Business.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                type: true,
                description: true,
                createdAt: true,
                ownerId: true,
                owner: {
                    select: {
                        userName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(businesses);
    } catch (error) {
        console.error('Error fetching businesses:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 