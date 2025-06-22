'use client';

import TimeTable from '@/app/User/TimeTable/TimeTable';
import TimeTableAdmin from '@/app/Admin/TimeTableAdmin/TimeTableAdmin';

export default function BusinessTimetablePage({ data, weekRange, isAdmin = false }) {
    if (isAdmin) {
        return <TimeTableAdmin data={data} weekRange={weekRange} />;
    } else {
        return <TimeTable data={data} weekRange={weekRange} />;
    }
} 