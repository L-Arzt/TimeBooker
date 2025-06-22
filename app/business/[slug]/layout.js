import { Inter } from 'next/font/google';
import TimeBookerHeader from '../../components/TimeBookerHeader';
import TimeBookerFooter from '../../components/TimeBookerFooter';
import { getServerSession } from 'next-auth';
import React from 'react';
import { getBusinessBySlug } from '@/app/libs/businessService';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default async function BusinessLayout({ children, params }) {
    const session = await getServerSession();

    // Получаем данные бизнеса по slug
    const business = await getBusinessBySlug(params.slug);

    // Если бизнес не найден, показываем 404
    if (!business) {
        notFound();
    }

    const businessData = {
        name: business.name,
        type: business.type || 'Бизнес на TimeBooker',
        slug: business.slug
    };

    return (
        <div className="flex flex-col min-h-screen">
            <TimeBookerHeader
                businessName={businessData.name}
                businessType={businessData.type}
                businessSlug={businessData.slug}
                isMainPage={false}
            />
            <main className="flex-grow">
                {React.cloneElement(children, { session, business })}
            </main>
            <TimeBookerFooter
                businessName={businessData.name}
                businessType={businessData.type}
            />
        </div>
    );
} 