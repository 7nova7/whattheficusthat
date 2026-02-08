import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/home/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  {
    id: '6',
    name: 'Pothos Golden',
    description: 'Easy-care trailing vine with golden variegation',
    price: 15,
    category: 'beginner_friendly',
    image_url: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?q=80&w=800',
    palmstreet_url: null,
    is_available: true,
  },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideSold, setHideSold] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setProducts(data && data.length > 0 ? data : sampleProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = hideSold 
    ? products.filter(p => p.is_available) 
    : products;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-accent font-medium mb-2 block">Our Collection</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop All Plants 🌿
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of handpicked rare and exotic plants. 
              Each plant links directly to our PalmStreet store for easy purchasing.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center justify-end gap-3 mb-6">
            <Label htmlFor="hide-sold" className="text-sm text-muted-foreground cursor-pointer">
              Hide sold items
            </Label>
            <Switch
              id="hide-sold"
              checked={hideSold}
              onCheckedChange={setHideSold}
            />
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {hideSold ? 'All plants have been sold! Check back soon for new additions.' : 'No plants available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                  isInView={true}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
