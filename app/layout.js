import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from './components/ThemeProvider';
import { getServerSession } from 'next-auth';
import HeaderElem from './elemPage/Header';
import FooterElem from './elemPage/Footer';
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
      <body>
        <header>
          <HeaderElem />
        </header>
        <main>
          <ThemeProvider session={session}>
            {React.cloneElement(children, { session })}
          </ThemeProvider>
        </main>
        <footer>
          <FooterElem />
        </footer>
      </body>
    </html>
  );
}
