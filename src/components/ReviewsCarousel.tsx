
import React, { useState } from 'react';
import { ReviewItem } from './ReviewCard';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import ReviewCard from './ReviewCard';

interface ReviewsCarouselProps {
  reviews: ReviewItem[];
}

const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ reviews }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        dragFree: true,
        containScroll: "trimSnaps",
      }}
      className="w-full"
      onMouseEnter={() => setIsCarouselHovered(true)}
      onMouseLeave={() => {
        setIsCarouselHovered(false);
        setHoveredIndex(null);
      }}
    >
      <CarouselContent>
        {reviews.map((review, index) => (
          <CarouselItem 
            key={review.id} 
            className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <ReviewCard 
              review={review} 
              isHovered={hoveredIndex === index}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 md:-left-6" />
      <CarouselNext className="-right-4 md:-right-6" />
    </Carousel>
  );
};

export default ReviewsCarousel;
