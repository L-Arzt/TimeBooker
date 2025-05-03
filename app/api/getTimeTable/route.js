
import { PrismaClient } from '@prisma/client';

export async function POST(req) {
    const { monday, sunday, userId } = await req.json();
    const prisma = new PrismaClient();

    async function getData() {
        const data = await prisma.timetable.findMany({
            where: {
                date: {
                    gte: monday,
                    lte: sunday,
                },
                userId: userId, // Добавляем userId в условие
            },
        });

        return data;
    }

    const data = await getData();
    return new Response(JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
