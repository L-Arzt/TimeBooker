import Image from "next/image";
import Link from "next/link";

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
    // Business data based on slug
    const businessData = {
        'englishpro': {
            name: 'EnglishPro',
            type: 'Школа английского языка',
            description: 'Современная школа английского языка для детей и подростков с индивидуальным подходом к каждому ученику.',
            level: 'C1 (Advanced)',
            about: 'Наша школа использует современные методики обучения. Преподаватели имеют международный опыт и регулярно проходят стажировки за рубежом.'
        }
    };

    const business = businessData[params.slug] || businessData['englishpro'];

    return (
        <>
            {/* TimeBooker Platform Header */}
            <TimeBookerHeader
                businessName={business.name}
                businessType={business.type}
                isMainPage={false}
            />

            {/* Business Content */}
            <section className="relative bg-white">
                <Image className="absolute w-full -top-[5%] -z-30 opacity-20" src={bgMain} alt="Background" />

                <section className="flex items-center justify-around my-10 relative flex-wrap">
                    <header>
                        <h1 className="text-[#2C3E50] text-[33px] py-5 font-bold">
                            {business.type} <span className="text-[#E74C3C]">{business.name}</span>
                        </h1>
                        <h1 className="text-[#34495E] text-[33px] py-5 font-semibold">Профессиональное обучение английскому языку</h1>
                        <p className="text-[20px] py-5 text-[#5D6D7E] leading-relaxed">{business.description}</p>
                        <button className="flex border items-center justify-center border-[#E74C3C] rounded-2xl bg-[#E74C3C] py-3 px-8 transition-all duration-300 hover:bg-[#C0392B] hover:scale-105 hover:shadow-lg">
                            <Link href='/#pricesBlock'><h1 className="text-white font-semibold">Узнать цены</h1></Link>
                        </button>
                    </header>

                    <figure className="relative w-[650px] h-[500px] mb-10">
                        <ImageWithBorder
                            src={img1}
                            alt="Logo image"
                            width={400}
                            height={400}
                            borderRadius={20}
                            imgStyle="absolute z-40 top-[80px] left-[200px] transition-transform duration-300 hover:scale-105"
                            borderStyle="absolute z-20 top-[120px] left-[240px] w-[400px] h-[400px] border-2 border-[#E74C3C] rounded-3xl shadow-lg"
                        />
                        <ImageWithBorder
                            src={img2}
                            alt="Logo image"
                            width={400}
                            height={400}
                            imgStyle="absolute z-10 blur-[2px]"
                            borderStyle="absolute top-10 left-10 z-0 w-[400px] h-[400px] border border-[#E74C3C] rounded-3xl"
                        />
                    </figure>
                    <figure className="absolute bottom-0 left-0">
                        <Image
                            src={bookimg}
                            alt="Logo image"
                            className="transition-transform duration-300 hover:scale-110"
                        />
                    </figure>
                </section>

                <section className="bg-white">
                    <header className="flex items-center justify-center flex-col">
                        <figure>
                            <Image
                                src={aboutmeimgmain}
                                alt="Logo image"
                                className="transition-transform duration-300 hover:scale-110"
                            />
                        </figure>
                        <h1 className="text-[#2C3E50] text-[39px] font-bold mb-4">О нашей школе и методике обучения</h1>
                        <p className="text-[#E74C3C] text-[22px] font-semibold mb-2">Уровень преподавания: {business.level}</p>
                        <p className="text-[#5D6D7E] text-[22px] text-center max-w-4xl leading-relaxed">{business.about}</p>
                    </header>

                    <article className="flex items-center justify-center gap-[50px] m-20 flex-wrap">
                        <AboutMeCard
                            src={aboutmecardimg1}
                            alt="Card image"
                            width={90}
                            height={120}
                            cardtexth='Онлайн занятия'
                            cardtextp='Занятия проходят в Zoom. На уроках мы используем интерактивную онлайн-доску Miro, где ученики видят все задания в реальном времени.'
                        />
                        <AboutMeCard
                            src={aboutmecardimg1}
                            alt="Card image"
                            width={90}
                            height={120}
                            cardtexth='Учебные материалы'
                            cardtextp='Школа предоставляет все необходимые материалы для занятий. Ученикам не нужно ничего покупать дополнительно.'
                        />
                        <AboutMeCard
                            src={aboutmecardimg1}
                            alt="Card image"
                            width={90}
                            height={120}
                            cardtexth='Личный кабинет'
                            cardtextp='Каждому ученику предоставляется доступ к личному кабинету для отслеживания расписания занятий и прогресса обучения.'
                        />
                        <AboutMeCard
                            src={aboutmecardimg1}
                            alt="Card image"
                            width={90}
                            height={120}
                            cardtexth='Мы гарантируем'
                            cardtextp='Интересные уроки с использованием интерактивных методов для комплексного развития всех языковых навыков.'
                        />
                    </article>
                </section>

                <section id="reviewsBlock" className="bg-gray-50 py-10">
                    <article className="flex items-center justify-center flex-col">
                        <header className="flex items-center justify-center flex-col my-5">
                            <figure>
                                <Image
                                    src={mainImg}
                                    alt="img header reviews"
                                    className="transition-transform duration-300 hover:scale-110"
                                />
                            </figure>
                            <h1 className="text-[#E74C3C] text-[36px] font-bold mb-4">Отзывы наших учеников</h1>
                        </header>
                        <ReviewsCarousel />
                    </article>
                </section>

                <section id="pricesBlock" className="mt-20 bg-white">
                    <header className="flex items-center justify-center flex-col">
                        <figure>
                            <Image
                                src={aboutmeimgmain}
                                alt="Logo image"
                                className="transition-transform duration-300 hover:scale-110"
                            />
                        </figure>
                        <h1 className="text-[#2C3E50] text-[39px] font-bold mb-4">Стоимость обучения</h1>
                    </header>

                    <article className="flex items-center justify-center gap-[50px] m-20 flex-wrap">
                        <PriceCard
                            src={aboutmecardimg1}
                            alt="Card image"
                            width={90}
                            height={120}
                            cardtextmain='Индивидуальное занятие'
                            cardtextdesc='Длительность 60 минут'
                            cardtextdesc2='Группа 1 человек'
                            cardtextprice='700'
                        />
                        <PriceCard
                            src={aboutmecardimg1}
                            alt="Card image"
                            width={90}
                            height={120}
                            cardtextmain='Групповое занятие'
                            cardtextdesc1='Длительность 60 минут'
                            cardtextdesc2='Группа 3-4 человека'
                            cardtextprice='400'
                        />
                        <PriceCard
                            src={aboutmecardimg1}
                            alt="Card image"
                            width={90}
                            height={120}
                            cardtextmain='Абонемент на 5 занятий'
                            cardtextdesc1='Длительность суммарно 300 минут'
                            cardtextdesc2='Индивидуально/в группе'
                            cardtextprice='3000/1700'
                        />
                    </article>
                </section>

                <section className="relative flex items-center justify-center m-20 bg-gradient-to-r from-[#E74C3C]/10 to-[#C0392B]/10 rounded-3xl p-8">
                    <figure className="">
                        <div className="absolute left-0 top-0 -z-50">
                            <Image
                                src={saleLeft}
                                alt="Decoration left sale block image"
                                className="opacity-20">
                            </Image>
                        </div>
                        <div className="absolute right-0 bottom-0 -z-50">
                            <Image
                                src={saleRight}
                                alt="Decoration right sale block image"
                                className="opacity-20">
                            </Image>
                        </div>
                    </figure>

                    <article className="flex items-center justify-center flex-col gap-3">
                        <figure className="my-20">
                            <Image
                                src={saleBook}
                                alt="Image sale block main"
                                className="transition-transform duration-300 hover:scale-110"
                            />
                        </figure>
                        <h1 className="text-[24px] text-[#2C3E50] font-bold mb-2">Записывайтесь на пробное занятие со скидкой!</h1>
                        <p className="text-[16px] text-[#5D6D7E] mb-6 text-center">При записи на сайте действует скидка 20% на пробное занятие.</p>
                        <ContactForm />
                    </article>
                </section>
            </section>

            {/* TimeBooker Platform Footer */}
            <TimeBookerFooter
                businessName={business.name}
                businessType={business.type}
            />
        </>
    );
}