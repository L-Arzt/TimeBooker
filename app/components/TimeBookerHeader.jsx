import Image from 'next/image';
import Link from 'next/link';
import logoImg from '../../public/Logo.png'
import ProfileImg from '../../public/ProfileImg.png'
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import NotificationCenter from './NotificationCenter';

export default async function TimeBookerHeader({ businessName, businessType, isMainPage = false }) {
  const session = await getServerSession(NextAuthOptions);
  const userRole = session?.user?.role || 'CLIENT';

  const getRoleBasedLinks = () => {
    switch (userRole) {
      case 'SPECIALIST':
        return (
          <>
            <Link href='/Specialist/Schedule'>
              <h3 className="text-[#FF9100]">Моё расписание</h3>
            </Link>
            <Link href='/Specialist/Services'>
              <h3 className="text-[#FF9100]">Мои услуги</h3>
            </Link>
          </>
        );
      case 'MANAGER':
        return (
          <>
            <Link href='/Manager/Schedule'>
              <h3 className="text-[#FF9100]">Расписание</h3>
            </Link>
            <Link href='/Manager/Bookings'>
              <h3 className="text-[#FF9100]">Бронирования</h3>
            </Link>
            <Link href='/Manager/Services'>
              <h3 className="text-[#FF9100]">Услуги</h3>
            </Link>
            <Link href='/Manager/Statistics'>
              <h3 className="text-[#FF9100]">Статистика</h3>
            </Link>
          </>
        );
      case 'ADMIN':
        return (
          <>
            <Link href='/Admin/Users'>
              <h3 className="text-[#FF9100]">Пользователи</h3>
            </Link>
            <Link href='/Admin/Roles'>
              <h3 className="text-[#FF9100]">Роли</h3>
            </Link>
            <Link href='/Admin/Settings'>
              <h3 className="text-[#FF9100]">Настройки</h3>
            </Link>
          </>
        );
      default: // CLIENT
        return (
          <>
            <Link href='/User/TimeTable'>
              <h3 className="text-[#FF9100]">Расписание</h3>
            </Link>
          </>
        );
    }
  };

  if (isMainPage) {
    // Main page header with user's logo
    return (
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - User's logo with TimeBooker branding */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Link href="/">
                  <Image
                    src={logoImg}
                    alt="TimeBooker Logo"
                    width={120}
                    height={30}
                    className="h-8 w-auto"
                  />
                </Link>
                <div className="hidden md:block">
                  <span className="text-xs text-gray-500">Платформа онлайн-бронирования</span>
                </div>
              </div>
            </div>

            {/* Right side - Navigation */}
            <div className="flex items-center space-x-6">
              <Link 
                href="/features" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Возможности
              </Link>
              <Link 
                href="/pricing" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Тарифы
              </Link>
              <Link 
                href="/support" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Поддержка
              </Link>
              <Link 
                href="/register" 
                className="bg-[#FF9100] hover:bg-[#E67E00] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Создать страницу
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Business page header with user's original header + business indicator
  return (
    <>
      {/* User's original header */}
      <section className="flex items-center justify-around border border-[#FF9100] rounded-3xl m-5 p-3 flex-wrap">
        <Link href="/">
          <figure>
            <Image
              width={100}
              height={20}
              src={logoImg}
              alt="Logo image"
            />
          </figure>
        </Link>

        <nav className="flex gap-10">
          <Link href='/#reviewsBlock'><h3 className="text-[#FF9100]">Отзывы</h3></Link>
          <Link href="/#pricesBlock"><h3 className="text-[#FF9100]">Цены</h3></Link>
          {getRoleBasedLinks()}
        </nav>

        <div className="flex items-center gap-4">
          {session && <NotificationCenter />}
          <button className="flex border items-center justify-center border-[#FF9100] rounded-2xl bg-[#FF9100] py-2 px-6">
            {!session ? (
              <Link href="/login">
                <h3 className="text-white">Вход</h3>
              </Link>
            ) : (
              <Link className='flex gap-2' href="/User/Profile">
                <h3 className="text-white">Профиль</h3>
                <figure>
                  <Image
                    src={ProfileImg}
                    alt="Profile image"
                  />
                </figure>
              </Link>
            )}
          </button>
        </div>
      </section>

      {/* Business indicator banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-blue-600">Вы находитесь на странице:</span>
              <span className="text-sm font-semibold text-blue-800">{businessName}</span>
              {businessType && (
                <span className="text-xs text-blue-600">({businessType})</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                О платформе
              </Link>
              <Link 
                href="/register" 
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Создать свою страницу
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}