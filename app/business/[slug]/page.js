import Image from "next/image";
import Link from "next/link";
import { getBusinessBySlug } from '@/app/libs/businessService';
import { notFound } from 'next/navigation';

import bgMain from '../../../public/bgMainPage.png'
import img1 from '../../../public/logoing.jpg'
import img2 from '../../../public/headerblockimg2.png'
import bookimg from '../../../public/headerblockbook.png'
import aboutmeimgmain from '../../../public/aboutmeimgmain.png'
import aboutmecardimg1 from '../../../public/aboutmecardimg1.png'
import mainImg from '../../../public/reviewsMainimg.png'
import CardImg1 from '../../../public/reviewsCardimg1.png'
import saleLeft from '../../../public/saleblockleftimg.png'
import saleRight from '../../../public/saleblockrightimg.png'
import saleBook from '../../../public/saleblockbook.png'

import TimeBookerHeader from '../../components/TimeBookerHeader'
import TimeBookerFooter from '../../components/TimeBookerFooter'

import ImageWithBorder from '../../elemPage/imagewithborder'
import AboutMeCard from '../../elemPage/aboutmeblockcard'
import ReviewsCard from '../../elemPage/reviewscard'
import PriceCard from '../../elemPage/priceblockcard'
import ContactForm from './ContactForm'
import ReviewsCarousel from './ReviewsCarousel'

export default async function BusinessPage({ params }) {
    // Получаем данные бизнеса по slug
    const business = await getBusinessBySlug(params.slug);

    // Если бизнес не найден, показываем 404
    if (!business) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Главный баннер */}
            <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl overflow-hidden mb-12">
                <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                <div className="relative z-10 py-16 px-8 md:px-16 flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{business.name}</h1>
                    <p className="text-xl max-w-2xl mb-8">{business.description || `Добро пожаловать на страницу ${business.name}`}</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href={`/business/${business.slug}/user/timetable`}
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                            Посмотреть расписание
                        </Link>
                    </div>
                </div>
            </section>

            {/* О нас */}
            <section className="mb-16" id="about">
                <h2 className="text-3xl font-bold mb-6 text-center">О нас</h2>
                <div className="bg-white rounded-lg shadow-md p-8">
                    <p className="text-gray-700 mb-4">
                        {business.description || `${business.name} предлагает высококачественные услуги для наших клиентов. Мы стремимся обеспечить максимальное удобство и качество обслуживания.`}
                    </p>
                    <p className="text-gray-700">
                        Наша система онлайн-бронирования позволяет вам легко записываться на удобное время, управлять своими записями и получать напоминания о предстоящих встречах.
                    </p>
                </div>
            </section>

            {/* Отзывы */}
            <section className="mb-16" id="reviews">
                <h2 className="text-3xl font-bold mb-6 text-center">Отзывы</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                                АК
                            </div>
                            <div>
                                <h3 className="font-semibold">Анна К.</h3>
                                <div className="flex text-yellow-400">
                                    ★★★★★
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">Отличный сервис! Легко записаться и всегда вовремя напоминают о встрече.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mr-4">
                                МС
                            </div>
                            <div>
                                <h3 className="font-semibold">Михаил С.</h3>
                                <div className="flex text-yellow-400">
                                    ★★★★☆
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">Очень удобно бронировать время онлайн, не нужно звонить и ждать ответа.</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mr-4">
                                ЕВ
                            </div>
                            <div>
                                <h3 className="font-semibold">Елена В.</h3>
                                <div className="flex text-yellow-400">
                                    ★★★★★
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700">Профессиональный подход и внимательное отношение к клиентам. Рекомендую!</p>
                    </div>
                </div>
            </section>

            {/* Цены */}
            <section className="mb-16" id="prices">
                <h2 className="text-3xl font-bold mb-6 text-center">Цены</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-blue-600 text-white py-4 px-6">
                            <h3 className="text-xl font-bold">Стандарт</h3>
                            <p className="text-blue-100">Базовый пакет услуг</p>
                        </div>
                        <div className="p-6">
                            <div className="text-3xl font-bold mb-4">1500 ₽</div>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Индивидуальный подход</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Онлайн-бронирование</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Напоминания о записи</span>
                                </li>
                            </ul>
                            <Link
                                href={`/business/${business.slug}/user/timetable`}
                                className="block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Забронировать
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-indigo-600 text-white py-4 px-6">
                            <h3 className="text-xl font-bold">Премиум</h3>
                            <p className="text-indigo-100">Расширенный пакет</p>
                        </div>
                        <div className="p-6">
                            <div className="text-3xl font-bold mb-4">2500 ₽</div>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Все услуги Стандарт</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Приоритетное обслуживание</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Дополнительные материалы</span>
                                </li>
                            </ul>
                            <Link
                                href={`/business/${business.slug}/user/timetable`}
                                className="block text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Забронировать
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-purple-600 text-white py-4 px-6">
                            <h3 className="text-xl font-bold">VIP</h3>
                            <p className="text-purple-100">Максимальный комфорт</p>
                        </div>
                        <div className="p-6">
                            <div className="text-3xl font-bold mb-4">4000 ₽</div>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Все услуги Премиум</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Персональный менеджер</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Гибкое расписание</span>
                                </li>
                            </ul>
                            <Link
                                href={`/business/${business.slug}/user/timetable`}
                                className="block text-center bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
                            >
                                Забронировать
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Контакты */}
            <section className="mb-16" id="contact">
                <h2 className="text-3xl font-bold mb-6 text-center">Контакты</h2>
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Свяжитесь с нами</h3>
                            <div className="space-y-3">
                                <p className="flex items-center">
                                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                        📞
                                    </span>
                                    <span>+7 (999) 123-45-67</span>
                                </p>
                                <p className="flex items-center">
                                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                        ✉️
                                    </span>
                                    <span>info@{business.slug}.ru</span>
                                </p>
                                <p className="flex items-center">
                                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                                        📍
                                    </span>
                                    <span>г. Москва, ул. Примерная, д. 123</span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Часы работы</h3>
                            <table className="w-full">
                                <tbody>
                                    <tr className="border-b">
                                        <td className="py-2">Понедельник - Пятница</td>
                                        <td className="py-2 text-right">9:00 - 20:00</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2">Суббота</td>
                                        <td className="py-2 text-right">10:00 - 18:00</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Воскресенье</td>
                                        <td className="py-2 text-right">Выходной</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}