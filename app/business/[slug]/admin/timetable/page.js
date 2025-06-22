import TimeTableAdmin from './TimeTableAdmin.jsx';
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '../../../../../config';
import { notFound } from 'next/navigation';
import prisma from '@/app/libs/prisma';

export default async function AdminTimetablePage({ params }) {
    const { slug } = params;
    const session = await getServerSession(NextAuthOptions);
    if (!session) return notFound();

    // Получаем роль пользователя
    const user = await prisma.users.findUnique({ where: { id: session.user.id } });

    const weekRange = { from: new Date(), to: new Date() };
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    let body = {
        monday: weekRange.from,
        sunday: weekRange.to,
    };
    if (user.role === 'business') {
        body.slug = slug;
    }
    const res = await fetch(`${baseUrl}/api/getTimeTableAdmin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
    });
    const data = res.ok ? (await res.json()).data : [];

    return <TimeTableAdmin data={data} weekRange={weekRange} />;
}


