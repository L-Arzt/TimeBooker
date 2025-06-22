import { PrismaClient } from '@prisma/client';
import TimeTable from '@/app/User/TimeTable/TimeTable';

export default async function TimeTablePage() {
    const prisma = new PrismaClient({});

    function getMonday(d) {
        d = new Date(d);
        d.setHours(3);
        d.setMinutes(0, 0, 0);

        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function getSunday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? 0 : 7);
        return new Date(d.setDate(diff));
    }

    const weekRange = {
        from: getMonday(new Date()),
        to: getSunday(new Date()),
    };

    async function getData() {
        const data = await prisma.timetable.findMany({
            where: {
                date: {
                    gte: weekRange.from,
                    lte: weekRange.to,
                },
            },
        });
        return data;
    }

    const data = await getData();
    return <TimeTable data={data} weekRange={weekRange} />;
} 