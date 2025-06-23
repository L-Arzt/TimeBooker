'use client';
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
import saleLeft from '../../../public/saleblockleftimg.png'
import saleRight from '../../../public/saleblockrightimg.png'

import ImageWithBorder from '../../elemPage/imagewithborder'
import AboutMeCard from '../../elemPage/aboutmeblockcard'
import PriceCard from '../../elemPage/priceblockcard'
import ReviewsSlider from './ReviewsSlider';
import ReviewsCarousel from './ReviewsCarousel';
import PromoBlock from './PromoBlock';

export default async function BusinessDynamicPage({ params }) {
    const business = await getBusinessBySlug(params.slug);
    if (!business) notFound();
    const features = business.features ? JSON.parse(business.features) : [];
    const prices = business.prices ? JSON.parse(business.prices) : [];
    const promo = business.promo ? JSON.parse(business.promo) : {};
    const reviews = business.reviews ? JSON.parse(business.reviews) : [
        { name: "Мария", text: "Отличный преподаватель! С детьми очень внимательна и дружелюбна, находит индивидуальный подход, чтобы заинтересовать ребенка занятиями. И как результат - есть прогресс! Рады, что решили заниматься с Ульяной.", rating: 5 },
        { name: "Title", text: "Description", rating: 3 },
        { name: "Title", text: "Description", rating: 3 },
    ];

    return (
        <section className="relative">
            <Image className="absolute w-full -top-[10%] -z-30" src={bgMain} alt="bg" />
            <section className="flex items-center justify-around my-10  relative flex-wrap">
                <header>
                    <h1 className="text-[#374B5C] text-[33px] py-5">{business.type}</h1>
                    <h1 className="text-[#374B5C] text-[33px] py-5">{business.name}</h1>
                    <p className="text-[20px] py-5">{business.tagline || business.description}</p>
                    <button className="flex border items-center justify-center border-[#FF9100] rounded-2xl bg-[#FF9100] py-2 px-8 ">
                        <Link href='/#pricesBlock'><h1 className="text-white">Узнать цены</h1></Link>
                    </button>
                </header>
                <figure className="relative w-[650px] h-[500px] mb-10">
                    <ImageWithBorder
                        src={img1}
                        alt="Logo image"
                        width={400}
                        height={400}
                        borderRadius={20}
                        imgStyle="absolute  z-40 top-[80px] left-[200px] "
                        borderStyle="absolute z-20 top-[120px] left-[240px] w-[400px] h-[400px] border border-[#FF9100] rounded-3xl"
                    />
                    <ImageWithBorder
                        src={img2}
                        alt="Logo image"
                        width={400}
                        height={400}
                        imgStyle="absolute z-10 blur-[2px] "
                        borderStyle="absolute top-10 left-10 z-0 w-[400px] h-[400px] border border-[#FF9100] rounded-3xl"
                    />
                </figure>
                <figure className="absolute bottom-0 left-0">
                    <Image src={bookimg} alt="Logo image" />
                </figure>
            </section>
            <section>
                <header className="flex items-center justify-center flex-col">
                    <figure>
                        <Image src={aboutmeimgmain} alt="Logo image" />
                    </figure>
                    <h1 className="text-[#A56714] text-[39px]">О нас</h1>
                    {business.level && <p className="text-[#A56714] text-[22px]">Уровень: {business.level}</p>}
                    <p className="text-[#A56714] text-[22px]">{business.about}</p>
                </header>
                <article className="flex items-center justify-center gap-[50px] m-20 flex-wrap">
                    {features.map((feature, idx) => (
                        <AboutMeCard
                            key={idx}
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
            <section id="reviewsBlock">
                <article className="flex items-center justify-center flex-col">
                    <header className="flex items-center justify-center flex-col my-5">
                        <figure>
                            <Image src={mainImg} alt="img header reviews" />
                        </figure>
                        <h1 className="text-[#FF9100] text-[36px]">Отзывы</h1>
                    </header>
                    <ReviewsSlider reviews={reviews} />
                </article>
            </section>
            <section id="pricesBlock" className="mt-20">
                <header className="flex items-center justify-center flex-col">
                    <figure>
                        <Image src={aboutmeimgmain} alt="Logo image" />
                    </figure>
                    <h1 className="text-[#A56714] text-[39px]">Цены на занятия</h1>
                </header>
                <article className="flex items-center justify-center gap-[50px] m-20 flex-wrap">
                    {prices.map((price, idx) => (
                        <PriceCard
                            key={idx}
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
            <section className="relative flex items-center justify-center m-20 ">
                <figure className="">
                    <div className=" absolute left-0 top-0 -z-50">
                        <Image src={saleLeft} alt="Decoration left sale block image" />
                    </div>
                    <div className="absolute right-0 bottom-0 -z-50">
                        <Image src={saleRight} alt="Decoration right sale block image" />
                    </div>
                </figure>
                <PromoBlock promo={promo} />
            </section>
        </section>
    );
}