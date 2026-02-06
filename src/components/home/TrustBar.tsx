import { Star, ShoppingBag, MessageSquare, Users } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const stats = [
  { icon: Star, value: '5.0', label: 'Star Rating', suffix: '⭐' },
  { icon: ShoppingBag, value: '1,900+', label: 'Sales' },
  { icon: MessageSquare, value: '415+', label: 'Reviews' },
  { icon: Users, value: '2,600+', label: 'Followers' },
];

export function TrustBar() {
  const [ref, isInView] = useInView<HTMLElement>();

  return (
    <section 
      id="trust" 
      ref={ref}
      className="bg-primary py-8 md:py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                'text-center transition-all duration-500',
                isInView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="h-5 w-5 text-secondary mr-2" />
                <span className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="ml-1 text-lg">{stat.suffix}</span>
                )}
              </div>
              <p className="text-primary-foreground/70 text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
