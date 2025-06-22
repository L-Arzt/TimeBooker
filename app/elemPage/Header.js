import Image from 'next/image';
import logoImg from '../../public/Logo.png'
import ProfileImg from '../../public/ProfileImg.png'
import { getServerSession } from 'next-auth';
import { NextAuthOptions } from '@/config';
import Link from 'next/link';
import NotificationCenter from '../components/NotificationCenter';

export default async function HeaderElem() {
    const session = await getServerSession(NextAuthOptions);
    const userRole = session?.user?.role || 'user';

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
            default: // user
                return (
                    <>
                        <Link href='/User/TimeTable'>
                            <h3 className="text-[#FF9100]">Расписание</h3>
                        </Link>
                    </>
                );
        }
    };

    return (
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
    );
}
