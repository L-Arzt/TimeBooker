'use client'

import Image from "next/image";
import InputMask from 'react-input-mask';

import bgMain from '../public/bgMainPage.png'
import img1 from '../public/Glorbo.jpg'
import img2 from '../public/headerblockimg2.png'
import bookimg from '../public/headerblockbook.png'
import aboutmeimgmain from '../public/aboutmeimgmain.png'
import aboutmecardimg1 from '../public/aboutmecardimg1.png'
import mainImg from '../public/reviewsMainimg.png'
import CardImg1 from '../public/reviewsCardimg1.png'
import saleLeft from '../public/saleblockleftimg.png'
import saleRight from '../public/saleblockrightimg.png'
import saleBook from '../public/saleblockbook.png'
import bgFooter from '../public/bgFooter.png'


import ImageWithBorder from './elemPage/imagewithborder'
import AboutMeCard from './elemPage/aboutmeblockcard'
import ReviewsCard from './elemPage/reviewscard'
import PriceCard from './elemPage/priceblockcard'


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  // type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {

  const [api, setApi] = useState()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const [phoneNumber, setPhoneNumber] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [userName, setUserName] = useState("");
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    if (value.replace(/[^0-9]/g, "").length === 11) {
      setShowNameInput(true);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/addSalesUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          name: userName,
        }),
      });

      if (response.ok) {
        const newUser = await response.json();
        console.log('Новый пользователь добавлен:', newUser);

        // Очистка полей после отправки
        setPhoneNumber("");
        setUserName("");
        setShowNameInput(false);
      } else {
        console.error('Ошибка при добавлении пользователя');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])



  return (
    <section className="relative">
      <Image className="absolute w-full -top-[5%] -z-30" src={bgMain}></Image>



      <section className="flex items-center justify-around my-10  relative flex-wrap">
        <header>
          <h1 className="text-[#374B5C] text-[33px] py-5">Репетитор по Английскому языку</h1>
          <h1 className="text-[#374B5C] text-[33px] py-5">Glorbo Fruttodrillo</h1>
          <p className="text-[20px] py-5">Частный преподаватель по Английскому языку для детей и подростков.</p>
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
          <Image
            src={bookimg}
            alt="Logo image"
          />
        </figure>

      </section>

      <section >
        <header className="flex items-center justify-center flex-col">
          <figure>
            <Image
              src={aboutmeimgmain}
              alt="Logo image"
            />
          </figure>
          <h1 className="text-[#A56714] text-[39px]">Немного обо мне и о моих занятиях</h1>
          <p className="text-[#A56714] text-[22px]">Уровень языка: C1 (Advanced) </p>
          <p className="text-[#A56714] text-[22px]">Изучала английский язык с ранних лет. Много практиковалась зарубежом. Посетила большую половину стран и городов в Европе.</p>
        </header>

        <article className="flex items-center justify-center gap-[50px] m-20">
          <AboutMeCard
            src={aboutmecardimg1}
            alt="Card image"
            width={90}
            height={120}
            cardtexth='Online Занятия'
            cardtextp='Занятия проходят в Zооm. На уроках я использую онлайн-доску Мirо, на которой ребенок будет видеть все задания. '
          />
          <AboutMeCard
            src={aboutmecardimg1}
            alt="Card image"
            width={90}
            height={120}
            cardtexth='Материалы занятий '
            cardtextp='Для занятий со мной вам не потребуется ничего. 
              Весь материал для уроков я предоставлю в виде на печатных заданий. '
          />
          <AboutMeCard
            src={aboutmecardimg1}
            alt="Card image"
            width={90}
            height={120}
            cardtexth='Личный кабинет'
            cardtextp='Для просмотра графиков занятий со мной,  ученику будут предоставлены данные от его личного кабинета.'
          />
          <AboutMeCard
            src={aboutmecardimg1}
            alt="Card image"
            width={90}
            height={120}
            cardtexth='Я гарантирую'
            cardtextp='Интересные уроки с использованием интерактивного метода для комплексного совершенствования навыков знания языка.'
          />
        </article>
      </section>

      <section id="reviewsBlock">
        <article className="flex items-center justify-center flex-col">
          <header className="flex items-center justify-center flex-col my-5">
            <figure>
              <Image
                src={mainImg}
                alt="img header reviews"
              />
            </figure>
            <h1 className="text-[#FF9100] text-[36px]">Отзывы</h1>
          </header>
          <Carousel setApi={setApi}
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]} className="w-full max-w-[600px]">
            <CarouselContent>


              <CarouselItem >
                <ReviewsCard src={CardImg1}
                  cardtexth="Мария"
                  cardtextp="Отличный преподаватель! С детьми очень внимательна и дружелюбна, находит индивидуальный подход, чтобы заинтересовать ребенка занятиями. И как результат - есть прогресс! Рады, что решили заниматься с Ульяной."
                  rating={1} />
              </CarouselItem>
              <CarouselItem >
                <ReviewsCard src={CardImg1}
                  cardtexth="Title"
                  cardtextp="Description"
                  rating={3} />
              </CarouselItem>
              <CarouselItem >
                <ReviewsCard src={CardImg1}
                  cardtexth="Title"
                  cardtextp="Description"
                  rating={3} />
              </CarouselItem>

              <CarouselItem >
                <ReviewsCard src={CardImg1}
                  cardtexth="Title"
                  cardtextp="Description"
                  rating={3} />
              </CarouselItem>

              <CarouselItem >
                <ReviewsCard src={CardImg1}
                  width={200}
                  height={200}
                  cardtexth="Title"
                  cardtextp="Description"
                  rating={3} />
              </CarouselItem>






            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="py-2 text-center text-sm text-muted-foreground">
            {Array.from({ length: count }).map((_, index) => (
              <span key={index} style={{ color: index === current - 1 ? 'red' : 'grey' }}>•</span>
            ))}
          </div>
        </article>
      </section>

      <section id="pricesBlock" className="mt-20">
        <header className="flex items-center justify-center flex-col">
          <figure>
            <Image
              src={aboutmeimgmain}
              alt="Logo image"
            />
          </figure>
          <h1 className="text-[#A56714] text-[39px]">Цены на занятия</h1>
        </header>

        <article className="flex items-center justify-center gap-[50px] m-20">
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
            cardtextdesc1='Длительность 60 минут Группа 3-4 человека'
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
            cardtextdesc2='Группа 1 человека/группа 1 человек'
            cardtextprice='3000/1700'
          />


        </article>
      </section>
      <section className="relative flex items-center justify-center m-20 ">
        <figure className="">
          <div className=" absolute left-0 top-0 -z-50">
            <Image
              src={saleLeft}
              alt="Decoration left sale block image">
            </Image>
          </div>
          <div className="absolute right-0 bottom-0 -z-50">
            <Image
              src={saleRight}
              alt="Decoration right sale block image">
            </Image>
          </div>
        </figure>

        <article className="flex items-center justify-center flex-col gap-3">
          <figure className="my-20">
            <Image
              src={saleBook}
              alt="Image sale block main"
            />
          </figure>
          <h1 className="text-[24px] text-[#A56714] font-semibold">Записывайтесь на пробное занятие со скидкой!</h1>
          <p className="text-[16px] text-[#A56714]">При записи на сайте действует скидка 20% на пробное занятие.</p>
          <div className="my-10 border rounded-3xl border-[#A56714]">
            <form onSubmit={handleSubmit}>
              <InputMask
                mask="+7(999)-999-99-99"
                className="p-3 rounded-3xl text-[#AE8349] outline-none placeholder:text-[#AE8349]"
                placeholder="Ваш номер телефона"
                value={phoneNumber}
                onChange={handlePhoneChange}
              />
              {showNameInput && (
                <input
                  type="text"
                  className="p-3 rounded-3xl text-[#AE8349] outline-none placeholder:text-[#AE8349]"
                  placeholder="Ваше имя"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              )}
              <button className="bg-[#FF9100] text-white p-3 border border-[#A56714] rounded-3xl" type="submit">Отправить</button>
            </form>
          </div>
        </article>
      </section>


    </section>
  );
}
