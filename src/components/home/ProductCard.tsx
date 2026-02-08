import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

const placeholderImages = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=800&auto=format&fit=crop',
];

export function ProductCard({ product, index = 0, isInView = true }: ProductCardProps) {
  const imageUrl = product.image_url || placeholderImages[index % placeholderImages.length];
  const palmstreetLink = product.palmstreet_url || 'https://palmstreet.app';

  return (
    <Card 
      className={cn(
        'group overflow-hidden border-border hover-lift transition-all duration-500',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Clickable Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-500 group-hover:scale-110",
              !product.is_available && "grayscale-[60%] brightness-90"
            )}
          />
          {!product.is_available && (
            <>
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* Diagonal ribbon badge */}
              <div className="absolute top-4 -right-8 bg-destructive text-destructive-foreground text-xs font-bold py-1 px-10 rotate-45 shadow-lg tracking-wider">
                SOLD
              </div>
            </>
          )}
        </div>
      </Link>

      {/* Content */}
      <CardContent className="p-4 flex flex-col">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1 line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {/* Price - Full width */}
        <span className={cn(
          "font-serif text-xl font-bold mb-3",
          product.is_available ? "text-primary" : "text-muted-foreground line-through"
        )}>
          ${product.price.toFixed(2)}
        </span>
        
        {/* Button - Full width, stacked below price */}
        <Button 
          size="sm" 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground group/btn"
          asChild
          disabled={!product.is_available}
        >
          <a 
            href={palmstreetLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Buy Now
            <ExternalLink className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
