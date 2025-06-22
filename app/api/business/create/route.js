import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import prisma from '@/app/libs/prisma';

export async function POST(request) {
    try {
        const session = await getServerSession(NextAuthOptions);

        // Проверка авторизации
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Проверка роли - только admin может создавать бизнесы
        if (session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { name, slug, description, type, logoUrl, themeColor } = await request.json();

        // Проверка обязательных полей
        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Название и URL (slug) обязательны' },
                { status: 400 }
            );
        }

        // Проверка уникальности slug
        const existingBusiness = await prisma.Business.findUnique({
            where: { slug },
        });

        if (existingBusiness) {
            return NextResponse.json(
                { error: 'Бизнес с таким URL уже существует' },
                { status: 409 }
            );
        }

        // Создание бизнеса
        const business = await prisma.Business.create({
            data: {
                name,
                slug,
                description,
                type,
                logoUrl,
                themeColor,
                ownerId: session.user.id,
            },
        });

        return NextResponse.json(business, { status: 201 });
    } catch (error) {
        console.error('Error creating business:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 