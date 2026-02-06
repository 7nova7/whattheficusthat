import { supabase } from '@/integrations/supabase/client';

export interface PalmStreetProduct {
  name: string;
  price: number;
  image_url: string | null;
  palmstreet_url: string;
}

export interface ScrapeResult {
  success: boolean;
  data?: PalmStreetProduct;
  error?: string;
}

export const palmstreetApi = {
  async scrapeUrl(url: string): Promise<ScrapeResult> {
    try {
      const { data, error } = await supabase.functions.invoke('palmstreet-scrape', {
        body: { url },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return data as ScrapeResult;
    } catch (error) {
      console.error('Error calling palmstreet-scrape:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scrape URL',
      };
    }
  },

  async importProduct(product: PalmStreetProduct): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('products').insert({
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        palmstreet_url: product.palmstreet_url,
        is_available: true,
        is_featured: false,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error inserting product:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save product',
      };
    }
  },
};
