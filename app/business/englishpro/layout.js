import { Inter } from 'next/font/google';
import TimeBookerHeader from '../../components/TimeBookerHeader';
import TimeBookerFooter from '../../components/TimeBookerFooter';
import { getServerSession } from 'next-auth';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

const businessData = {
    name: 'EnglishPro',
    type: 'Школа английского языка'
};

export default async function BusinessLayout({ children }) {
    const session = await getServerSession();

    return (
        <div className="flex flex-col min-h-screen">
            <TimeBookerHeader
                businessName={businessData.name}
                businessType={businessData.type}
                isMainPage={false}
            />
            <main className="flex-grow">
                {React.cloneElement(children, { session })}
            </main>
            <TimeBookerFooter
                businessName={businessData.name}
                businessType={businessData.type}
            />
        </div>
    );
} 