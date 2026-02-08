import { Star, ShoppingBag, MessageSquare, Users, Leaf } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const stats = [
  { icon: Star, value: '5.0', label: 'Star Rating' },
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
      className="relative py-16 md:py-20 overflow-hidden"
    >
      {/* Gradient Background with Botanical Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90">
        <div className="absolute inset-0 botanical-pattern opacity-10" />
      </div>
      
      {/* Decorative floating leaves */}
      <Leaf className="absolute top-8 left-[10%] h-8 w-8 text-secondary/20 rotate-45" />
      <Leaf className="absolute top-16 right-[8%] h-6 w-6 text-secondary/15 -rotate-12" />
      <Leaf className="absolute bottom-12 right-[15%] h-7 w-7 text-secondary/20 rotate-[30deg]" />
      <Leaf className="absolute bottom-8 left-[12%] h-5 w-5 text-secondary/15 -rotate-45" />
      
      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div 
          className={cn(
            "text-center mb-10 transition-all duration-700",
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <span className="text-secondary font-medium text-sm tracking-wider uppercase">
            Trusted by Plant Lovers
          </span>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                // Glass card effect
                "group relative bg-white/10 backdrop-blur-md rounded-2xl p-6",
                "border border-white/20 shadow-lg",
                "hover:bg-white/15 hover:scale-105 hover:shadow-xl",
                "transition-all duration-500 ease-out cursor-default",
                // Special treatment for star rating (first card)
                index === 0 && "ring-2 ring-gold/30",
                // Entrance animation
                isInView 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-8 scale-95'
              )}
              style={{ transitionDelay: `${index * 100 + 100}ms` }}
            >
              {/* Glow effect behind icon */}
              <div className={cn(
                "absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full blur-xl transition-opacity duration-500",
                index === 0 ? "bg-gold/40" : "bg-secondary/30",
                "group-hover:opacity-80"
              )} />
              
              {/* Icon */}
              <div className="relative flex justify-center mb-3">
                <stat.icon className={cn(
                  "h-8 w-8 transition-transform duration-300 group-hover:scale-110",
                  index === 0 ? "text-gold fill-gold/20" : "text-secondary"
                )} />
              </div>
              
              {/* Value & Label */}
              <div className="text-center relative">
                <span className={cn(
                  "font-serif text-3xl md:text-4xl font-bold block",
                  index === 0 ? "text-gold" : "text-primary-foreground"
                )}>
                  {stat.value}
                </span>
                <span className="text-primary-foreground/60 text-sm mt-1 block">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
