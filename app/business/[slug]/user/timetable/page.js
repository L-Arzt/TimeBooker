import TimeTable from './TimeTable.jsx';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '../../../../../config';
import { notFound } from 'next/navigation';

export default async function UserTimetablePage({ params }) {
    const { slug } = params;
    const session = await getServerSession(NextAuthOptions);
    if (!session) return notFound();

    const weekRange = { from: new Date(), to: new Date() };
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/getTimeTable?slug=${slug}`, { cache: 'no-store' });
    const data = res.ok ? (await res.json()).data : [];

    return <TimeTable data={data} weekRange={weekRange} />;
}