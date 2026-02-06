import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const placeholderImages = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=800&auto=format&fit=crop',
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
              Product Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrl = product.image_url || placeholderImages[0];
  const palmstreetLink = product.palmstreet_url || 'https://palmstreet.app';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.is_available && (
              <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Sold Out
                </Badge>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-serif text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.is_available ? (
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  Available
                </Badge>
              ) : (
                <Badge variant="secondary">Sold Out</Badge>
              )}
            </div>

            {product.description && (
              <div className="prose prose-sm max-w-none mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Description
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-auto pt-6 border-t">
              <Button
                size="lg"
                className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
                asChild
                disabled={!product.is_available}
              >
                <a
                  href={palmstreetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Buy on PalmStreet
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              {product.palmstreet_url && (
                <p className="text-sm text-muted-foreground mt-3">
                  You'll be redirected to PalmStreet to complete your purchase.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
