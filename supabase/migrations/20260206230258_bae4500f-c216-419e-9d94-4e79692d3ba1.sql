-- Add featured column to products table
ALTER TABLE public.products 
ADD COLUMN is_featured boolean NOT NULL DEFAULT false;

-- Create an index for efficient featured products queries
CREATE INDEX idx_products_featured ON public.products (is_featured) WHERE is_featured = true;