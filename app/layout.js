import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from './components/ThemeProvider';
import { getServerSession } from 'next-auth';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Time booker',
  description: 'Book what you need.',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ThemeProvider session={session}>
          {React.cloneElement(children, { session })}
        </ThemeProvider>
      </body>
    </html>
  );
}
