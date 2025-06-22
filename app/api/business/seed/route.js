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

        // Проверка роли - только admin может создавать бизнесы
        if (session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Проверяем, существуют ли уже бизнесы
        const existingBusinesses = await prisma.Business.findMany({
            where: {
                OR: [
                    { slug: 'englishpro' },
                    { slug: 'fitnessclub' }
                ]
            }
        });

        const results = [];

        // Создаем EnglishPro, если его нет
        if (!existingBusinesses.find(b => b.slug === 'englishpro')) {
            const englishPro = await prisma.Business.create({
                data: {
                    name: 'EnglishPro',
                    slug: 'englishpro',
                    description: 'Современная школа английского языка для детей и подростков с индивидуальным подходом к каждому ученику.',
                    type: 'Школа английского языка',
                    ownerId: session.user.id,
                }
            });
            results.push({ created: 'EnglishPro', id: englishPro.id });
        } else {
            results.push({ exists: 'EnglishPro' });
        }

        // Создаем FitnessClub, если его нет
        if (!existingBusinesses.find(b => b.slug === 'fitnessclub')) {
            const fitnessClub = await prisma.Business.create({
                data: {
                    name: 'FitnessClub',
                    slug: 'fitnessclub',
                    description: 'Современный фитнес-центр для всей семьи с широким спектром тренировок и программ.',
                    type: 'Фитнес-центр',
                    ownerId: session.user.id,
                }
            });
            results.push({ created: 'FitnessClub', id: fitnessClub.id });
        } else {
            results.push({ exists: 'FitnessClub' });
        }

        return NextResponse.json({ message: 'Seed completed', results }, { status: 200 });
    } catch (error) {
        console.error('Error seeding businesses:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 