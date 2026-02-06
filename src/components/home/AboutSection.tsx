import { Package, Truck, DollarSign, Heart, ThumbsUp, Clock } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const badges = [
  { icon: Package, label: 'Great Packaging', count: 320 },
  { icon: Truck, label: 'Quick Shipper', count: 293 },
  { icon: DollarSign, label: 'Fair Pricing', count: 287 },
  { icon: Heart, label: 'Friendly', count: 299 },
  { icon: ThumbsUp, label: 'As Described', count: 312 },
  { icon: Clock, label: 'Fast Response', count: 276 },
];

export function AboutSection() {
  const [ref, isInView] = useInView<HTMLElement>();

  return (
    <section id="about" ref={ref} className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div 
            className={cn(
              'relative transition-all duration-700',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            )}
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop"
                alt="Greenhouse with beautiful plants"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/30 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div 
            className={cn(
              'transition-all duration-700 delay-200',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            )}
          >
            <span className="text-accent font-medium mb-2 block">About Me</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Meet Eva, Your Plant Plug 🌱
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Hey there, plant lovers! I'm Eva, the passionate plant parent behind Whattheficusthat. 
                What started as a love for houseplants has grown into a licensed nursery dedicated to 
                bringing you the most stunning rare and exotic plants.
              </p>
              <p>
                I personally select and care for each plant before it makes its way to your home. 
                From Monstera magic to Philodendron perfection, I've got the green goods you're looking for!
              </p>
              <p>
                Join me on PalmStreet for live sales every week, where you can see the plants up close 
                and ask all your plant care questions. Let's grow together! 🌿
              </p>
            </div>

            {/* Review Badges */}
            <div className="mt-8">
              <h3 className="font-semibold text-foreground mb-4">What Buyers Say</h3>
              <div className="flex flex-wrap gap-3">
                {badges.map((badge, index) => (
                  <div
                    key={badge.label}
                    className={cn(
                      'flex items-center gap-2 bg-muted px-3 py-2 rounded-full transition-all duration-500',
                      isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    )}
                    style={{ transitionDelay: `${400 + index * 50}ms` }}
                  >
                    <badge.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{badge.label}</span>
                    <span className="text-xs text-muted-foreground">({badge.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
