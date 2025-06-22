'use client'

import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import ReviewsCard from '../../elemPage/reviewscard'
import CardImg1 from '../../../public/reviewsCardimg1.png'

export default function ReviewsCarousel() {
    const [api, setApi] = useState()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

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
        <>
            <Carousel setApi={setApi}
                plugins={[
                    Autoplay({
                        delay: 3000,
                    }),
                ]} className="w-full max-w-[600px]">
                <CarouselContent>
                    <CarouselItem>
                        <ReviewsCard src={CardImg1}
                            cardtexth="Мария"
                            cardtextp="Отличная школа! Преподаватели очень внимательны и дружелюбны, находят индивидуальный подход к каждому ребенку. Видим значительный прогресс в изучении языка. Рады, что выбрали школу EnglishPro."
                            rating={5} />
                    </CarouselItem>
                    <CarouselItem>
                        <ReviewsCard src={CardImg1}
                            cardtexth="Анна"
                            cardtextp="Школа EnglishPro превзошла все наши ожидания. Современная методика обучения и профессиональные преподаватели помогли моему сыну полюбить английский язык."
                            rating={4} />
                    </CarouselItem>
                    <CarouselItem>
                        <ReviewsCard src={CardImg1}
                            cardtexth="Дмитрий"
                            cardtextp="Замечательная школа с индивидуальным подходом. Дочь с удовольствием занимается, и мы видим реальный прогресс в знаниях."
                            rating={5} />
                    </CarouselItem>
                    <CarouselItem>
                        <ReviewsCard src={CardImg1}
                            cardtexth="Елена"
                            cardtextp="Школа EnglishPro - это именно то, что мы искали. Качественное обучение, удобное расписание и отличные результаты."
                            rating={4} />
                    </CarouselItem>
                    <CarouselItem>
                        <ReviewsCard src={CardImg1}
                            width={200}
                            height={200}
                            cardtexth="Сергей"
                            cardtextp="Рекомендую школу всем, кто хочет качественно изучить английский язык. Преподаватели профессионалы своего дела."
                            rating={5} />
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="hover:bg-[#E74C3C] hover:text-white transition-colors duration-300" />
                <CarouselNext className="hover:bg-[#E74C3C] hover:text-white transition-colors duration-300" />
            </Carousel>
            <div className="py-2 text-center text-sm text-muted-foreground">
                {Array.from({ length: count }).map((_, index) => (
                    <span
                        key={index}
                        className={`inline-block w-3 h-3 mx-1 rounded-full transition-all duration-300 cursor-pointer ${index === current - 1
                            ? 'bg-[#E74C3C] scale-125'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        onClick={() => api?.scrollTo(index)}
                    />
                ))}
            </div>
        </>
    );
} 