'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import ReviewsCard from '../../elemPage/reviewscard';
import CardImg1 from '../../../public/reviewsCardimg1.png';

export default function ReviewsSlider({ reviews }) {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);
  return (
    <>
      <Carousel setApi={setApi} plugins={[Autoplay({ delay: 2000 })]} className="w-full max-w-[600px]">
        <CarouselContent>
          {reviews.map((review, idx) => (
            <CarouselItem key={idx}>
              <ReviewsCard src={CardImg1} cardtexth={review.name} cardtextp={review.text} rating={review.rating} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        {Array.from({ length: count }).map((_, index) => (
          <span key={index} style={{ color: index === current - 1 ? 'red' : 'grey' }}>•</span>
        ))}
      </div>
    </>
  );
} 