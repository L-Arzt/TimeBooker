import { PrismaClient } from '@prisma/client';
import TimeTable from './TimeTableAdmin';

export default async function TimeTableAdminPage() {
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
        monday: getMonday(new Date()),
        sunday: getSunday(new Date()),
    };

    async function getData() {
        const data = await prisma.timetable.findMany({
            where: {
                date: {
                    gte: weekRange.monday,
                    lte: weekRange.sunday,
                },
            },
        });
        return data;
    }

    const data = await getData();
    return <TimeTable data={data} weekRange={weekRange} />;
}