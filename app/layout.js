import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from './components/ThemeProvider';
import { getServerSession } from 'next-auth';
import React from 'react';
import TimeBookerHeader from './components/TimeBookerHeader';
import TimeBookerFooter from './components/TimeBookerFooter';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Time booker',
  description: 'Book what you need.',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  // Определяем текущий путь
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '/';
  const isMainPage = pathname === '/';

  // Проверяем, находимся ли мы на странице бизнеса
  const isBusinessPage = pathname.startsWith('/business/');

  return (
    <html lang="ru">
      <body className={inter.className}>
        <ThemeProvider session={session}>
          {isBusinessPage ? (
            // Для страниц бизнеса не добавляем хедер и футер, так как они будут добавлены в layout бизнеса
            React.cloneElement(children, { session })
          ) : (
            // Для других страниц добавляем хедер и футер
            <div className="flex flex-col min-h-screen">
              <TimeBookerHeader isMainPage={isMainPage} />
              <main className="flex-grow">
                {React.cloneElement(children, { session })}
              </main>
              <TimeBookerFooter businessName="TimeBooker" businessType="Платформа онлайн-бронирования" />
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
