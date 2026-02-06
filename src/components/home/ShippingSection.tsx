import { Package, Truck, Zap, Plane, Clock, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const shippingOptions = [
  {
    icon: Package,
    title: 'Standard Shipping',
    description: 'Carefully packed and shipped via USPS Priority',
    price: 'Included',
    highlight: true,
  },
  {
    icon: Truck,
    title: '2-Day Upgrade',
    description: 'Faster delivery for those who can\'t wait',
    price: '$15',
  },
  {
    icon: Zap,
    title: 'Next-Day Upgrade',
    description: 'Get your plants ASAP',
    price: '$35',
  },
  {
    icon: Plane,
    title: 'Hawaii Shipping',
    description: 'Special handling for island deliveries',
    price: '$55',
  },
  {
    icon: Clock,
    title: 'Hold Shipping',
    description: 'We\'ll hold your order until you\'re ready',
    price: '$1',
  },
  {
    icon: Flame,
    title: 'Heat Pack',
    description: 'Keep plants warm during cold months',
    price: '$4',
  },
];

export function ShippingSection() {
  const [ref, isInView] = useInView<HTMLElement>();

  return (
    <section id="shipping" ref={ref} className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div 
          className={cn(
            'text-center mb-12 transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <span className="text-accent font-medium mb-2 block">Delivery</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shipping Information 📦
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We pack with love and care! Every plant is carefully wrapped to ensure it arrives 
            at your door healthy and happy. Here are our shipping options:
          </p>
        </div>

        {/* Shipping Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shippingOptions.map((option, index) => (
            <Card 
              key={option.title}
              className={cn(
                'border-border transition-all duration-500',
                option.highlight && 'border-primary bg-primary/5',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'p-3 rounded-xl',
                    option.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <option.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{option.title}</h3>
                      <span className={cn(
                        'font-serif font-bold',
                        option.highlight ? 'text-primary' : 'text-foreground'
                      )}>
                        {option.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Care Message */}
        <div 
          className={cn(
            'mt-12 text-center transition-all duration-700 delay-500',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <p className="text-lg text-muted-foreground">
            🌱 <span className="font-medium text-foreground">We pack with care!</span> Each plant is 
            individually wrapped and secured to survive the journey to your home.
          </p>
        </div>
      </div>
    </section>
  );
}
