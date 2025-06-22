import { PrismaClient } from '@prisma/client';
import BusinessTimetablePage from '@/app/components/BusinessTimetablePage';
import { getWeekRange } from '@/app/utils/dateUtils';

export default async function FitnessClubUserTimetablePage() {
    const prisma = new PrismaClient({});
    const weekRange = getWeekRange();

    async function getData() {
        const data = await prisma.timetable.findMany({
            where: {
                date: {
                    gte: weekRange.from,
                    lte: weekRange.to,
                },
                business: {
                    slug: 'fitnessclub'
                }
            },
        });
        return data;
    }

    const data = await getData();
    return <BusinessTimetablePage data={data} weekRange={weekRange} isAdmin={false} />;
} 