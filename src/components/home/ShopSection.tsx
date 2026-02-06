import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { useInView } from '@/hooks/useInView';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// Sample products for when database is empty
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Amazonica Pink Variegated Corm',
    description: 'Rare variegated corm ready to grow into a stunning specimen',
    price: 75,
    category: 'rare_finds',
    image_url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800',
    palmstreet_url: null,
    is_available: true,
  },
  {
    id: '2',
    name: 'Monstera Thai Constellation',
    description: 'Beautiful cream variegation on large fenestrated leaves',
    price: 120,
    category: 'aroids',
    image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800',
    palmstreet_url: null,
    is_available: true,
  },
  {
    id: '3',
    name: 'Philodendron Pink Princess',
    description: 'Gorgeous pink variegation on dark leaves',
    price: 65,
    category: 'aroids',
    image_url: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=800',
    palmstreet_url: null,
    is_available: true,
  },
  {
    id: '4',
    name: 'Anthurium Clarinervium',
    description: 'Heart-shaped velvet leaves with striking white veins',
    price: 45,
    category: 'aroids',
    image_url: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=800',
    palmstreet_url: null,
    is_available: true,
  },
  {
    id: '5',
    name: 'Hoya Kerrii Variegated',
    description: 'Adorable heart-shaped succulent leaves with cream edges',
    price: 40,
    category: 'hoyas',
    image_url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=800',
    palmstreet_url: null,
    is_available: true,
  },
];

export function ShopSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, isInView] = useInView<HTMLElement>();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        
        // If no featured products in database, use sample products (limited to 6)
        setProducts(data && data.length > 0 ? data : sampleProducts.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(sampleProducts.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <section id="shop" ref={ref} className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-accent font-medium mb-2 block">Our Collection</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Plants 🌿
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked rare and exotic plants, ready to ship to your door. 
            Each plant links directly to our PalmStreet store for easy purchasing.
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No plants available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-10">
          <Button asChild size="lg" variant="outline" className="group">
            <Link to="/shop">
              View All Plants
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
