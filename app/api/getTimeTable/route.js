import { PrismaClient } from '@prisma/client';
import prisma from '@/app/libs/prisma';

export async function POST(req) {
    const { monday, sunday, userId, slug } = await req.json();
    let businessId = undefined;
    if (slug) {
        const business = await prisma.business.findUnique({ where: { slug } });
        businessId = business ? business.id : undefined;
    }
    const prismaClient = new PrismaClient();

    async function getData() {
        const data = await prismaClient.timetable.findMany({
            where: {
                date: {
                    gte: monday,
                    lte: sunday,
                },
                ...(businessId && { businessId }),
            },
        });

        return data;
    }

    const data = await getData();
    return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
