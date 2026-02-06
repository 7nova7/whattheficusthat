import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  palmstreet_url: string | null;
  is_available: boolean;
}

interface ProductCardProps {
  product: Product;
  index?: number;
  isInView?: boolean;
}

const categoryLabels: Record<string, string> = {
  rare_finds: 'Rare Find',
  aroids: 'Aroid',
  hoyas: 'Hoya',
  beginner_friendly: 'Beginner Friendly',
  other: '',
};

const placeholderImages = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=800&auto=format&fit=crop',
];

export function ProductCard({ product, index = 0, isInView = true }: ProductCardProps) {
  const imageUrl = product.image_url || placeholderImages[index % placeholderImages.length];
  const categoryLabel = categoryLabels[product.category];
  const palmstreetLink = product.palmstreet_url || 'https://palmstreet.app';

  return (
    <Card 
      className={cn(
        'group overflow-hidden border-border hover-lift transition-all duration-500',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {!product.is_available && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="text-background font-semibold text-lg">Sold Out</span>
          </div>
        )}
        {categoryLabel && (
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
            {categoryLabel}
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-serif text-lg font-semibold text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            asChild
            disabled={!product.is_available}
          >
            <a 
              href={palmstreetLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              Buy on PalmStreet
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
