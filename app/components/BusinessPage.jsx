'use client';

import Image from "next/image";
import Link from "next/link";

import bgMain from '../../public/bgMainPage.png'
import img1 from '../../public/logoing.jpg'
import img2 from '../../public/headerblockimg2.png'
import bookimg from '../../public/headerblockbook.png'
import aboutmeimgmain from '../../public/aboutmeimgmain.png'
import aboutmecardimg1 from '../../public/aboutmecardimg1.png'
import mainImg from '../../public/reviewsMainimg.png'
import saleLeft from '../../public/saleblockleftimg.png'
import saleRight from '../../public/saleblockrightimg.png'
import saleBook from '../../public/saleblockbook.png'

import ImageWithBorder from '../elemPage/imagewithborder'
import AboutMeCard from '../elemPage/aboutmeblockcard'
import PriceCard from '../elemPage/priceblockcard'
import ContactForm from '../business/[slug]/ContactForm'
import ReviewsCarousel from '../business/[slug]/ReviewsCarousel'

export default function BusinessPage({ business }) {
    return (
        <section className="relative bg-white">
            <Image className="absolute w-full -top-[5%] -z-30 opacity-20" src={bgMain} alt="Background" />

            <section className="flex items-center justify-around my-10 relative flex-wrap">
                <header>
                    <h1 className="text-[#2C3E50] text-[33px] py-5 font-bold">
                        {business.type} <span className="text-[#E74C3C]">{business.name}</span>
                    </h1>
                    <h1 className="text-[#34495E] text-[33px] py-5 font-semibold">{business.tagline}</h1>
                    <p className="text-[20px] py-5 text-[#5D6D7E] leading-relaxed">{business.description}</p>
                    <button className="flex border items-center justify-center border-[#E74C3C] rounded-2xl bg-[#E74C3C] py-3 px-8 transition-all duration-300 hover:bg-[#C0392B] hover:scale-105 hover:shadow-lg">
                        <Link href='#pricesBlock'><h1 className="text-white font-semibold">Узнать цены</h1></Link>
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
                    <h1 className="text-[#2C3E50] text-[39px] font-bold mb-4">О нас</h1>
                    {business.level && (
                        <p className="text-[#E74C3C] text-[22px] font-semibold mb-2">Уровень: {business.level}</p>
                    )}
                    <p className="text-[#5D6D7E] text-[22px] text-center max-w-4xl leading-relaxed">{business.about}</p>
                </header>

                <article className="flex items-center justify-center gap-[50px] m-20 flex-wrap">
                    {business.features.map((feature, index) => (
                        <AboutMeCard
                            key={index}
                            src={aboutmecardimg1}
                            alt="Card image"
                            width={90}
                            height={120}
                            cardtexth={feature.title}
                            cardtextp={feature.description}
                        />
                    ))}
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
                        <h1 className="text-[#E74C3C] text-[36px] font-bold mb-4">Отзывы наших клиентов</h1>
                    </header>
                    <ReviewsCarousel businessSlug={business.slug} />
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
                    <h1 className="text-[#2C3E50] text-[39px] font-bold mb-4">Стоимость услуг</h1>
                </header>

                <article className="flex items-center justify-center gap-[50px] m-20 flex-wrap">
                    {business.prices.map((price, index) => (
                        <PriceCard
                            key={index}
                            src={aboutmecardimg1}
                            alt="Card image"
                            width={90}
                            height={120}
                            cardtextmain={price.title}
                            cardtextdesc={price.desc1}
                            cardtextdesc2={price.desc2}
                            cardtextprice={price.price}
                        />
                    ))}
                </article>
            </section>

            <section className="relative mt-20 mb-10 bg-white flex items-center justify-center">
                <figure className="absolute left-0 top-10">
                    <Image
                        src={saleLeft}
                        alt="Sale Left"
                        className="transition-transform duration-300 hover:scale-110"
                    />
                </figure>
                <figure className="absolute right-0 top-10">
                    <Image
                        src={saleRight}
                        alt="Sale Right"
                        className="transition-transform duration-300 hover:scale-110"
                    />
                </figure>
                <figure className="absolute right-[10%] bottom-0">
                    <Image
                        src={saleBook}
                        alt="Sale Book"
                        className="transition-transform duration-300 hover:scale-110"
                    />
                </figure>

                <div className="bg-gradient-to-r from-[#FFF3E0] to-[#FFECB3] rounded-3xl p-10 max-w-4xl relative z-10">
                    <h2 className="text-[#E74C3C] text-3xl font-bold mb-6 text-center">{business.promo.title}</h2>
                    <p className="text-[#5D6D7E] text-xl mb-6 text-center" dangerouslySetInnerHTML={{ __html: business.promo.description }} />
                    <div className="flex justify-center">
                        <Link href={`/business/${business.slug}/user/timetable`}>
                            <button className="bg-[#E74C3C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#C0392B] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                {business.promo.buttonText}
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <section id="contactBlock" className="bg-gray-50 py-10">
                <header className="flex items-center justify-center flex-col mb-10">
                    <h1 className="text-[#2C3E50] text-[39px] font-bold">Связаться с нами</h1>
                    <p className="text-[#5D6D7E] text-xl text-center max-w-2xl">
                        Остались вопросы? Заполните форму, и мы свяжемся с вами в ближайшее время.
                    </p>
                </header>
                <ContactForm businessSlug={business.slug} />
            </section>
        </section>
    );
} 