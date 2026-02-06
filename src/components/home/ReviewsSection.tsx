import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const reviews = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    text: 'Absolutely stunning plants! The Thai Constellation I received was even more beautiful than the photos. Eva packs with so much care - arrived in perfect condition!',
    date: 'December 2024',
  },
  {
    id: 2,
    name: 'Marcus R.',
    rating: 5,
    text: 'Best plant seller on PalmStreet! Fast shipping, amazing communication, and the healthiest plants I\'ve ever received. Already planning my next order!',
    date: 'November 2024',
  },
  {
    id: 3,
    name: 'Jessica L.',
    rating: 5,
    text: 'Eva is the real deal! Her live streams are so fun and informative. Got my Pink Princess from her and it\'s thriving. Highly recommend!',
    date: 'November 2024',
  },
  {
    id: 4,
    name: 'David K.',
    rating: 5,
    text: 'Third purchase from Whattheficusthat and every single time the experience has been perfect. The packaging is chef\'s kiss 👌',
    date: 'October 2024',
  },
  {
    id: 5,
    name: 'Amanda P.',
    rating: 5,
    text: 'Found my unicorn plant here! Eva went above and beyond to help me find exactly what I was looking for. A++ seller!',
    date: 'October 2024',
  },
];

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, isInView] = useInView<HTMLElement>();

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Auto-advance reviews
  useEffect(() => {
    const timer = setInterval(nextReview, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="reviews" ref={ref} className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div 
          className={cn(
            'text-center mb-12 transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <span className="text-accent font-medium mb-2 block">Testimonials</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Plant Parents Say 💬
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-muted-foreground">5.0 from 415+ reviews</span>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div 
          className={cn(
            'relative max-w-3xl mx-auto transition-all duration-700 delay-200',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <Card className="bg-card border-border">
            <CardContent className="p-8 md:p-12">
              <Quote className="h-10 w-10 text-secondary mb-6" />
              
              <div className="min-h-[150px]">
                <p className="text-lg md:text-xl text-foreground mb-6 italic">
                  "{reviews[currentIndex].text}"
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{reviews[currentIndex].name}</p>
                  <p className="text-sm text-muted-foreground">{reviews[currentIndex].date}</p>
                </div>
                <div className="flex">
                  {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevReview}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                  )}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextReview}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
