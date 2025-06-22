'use client';

import { Inter } from 'next/font/google';
import TimeBookerHeader from './TimeBookerHeader';
import TimeBookerFooter from './TimeBookerFooter';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function BusinessLayout({ children, businessData, session }) {
    return (
        <div className="flex flex-col min-h-screen">
            <TimeBookerHeader
                businessName={businessData.name}
                businessType={businessData.type}
                businessSlug={businessData.slug}
                isMainPage={false}
            />
            <main className="flex-grow">
                {React.cloneElement(children, { session, business: businessData })}
            </main>
            <TimeBookerFooter
                businessName={businessData.name}
                businessType={businessData.type}
            />
        </div>
    );
} 