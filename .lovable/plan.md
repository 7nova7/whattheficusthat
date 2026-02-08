

# Add "You Might Also Like" Section to Product Detail Page

## Overview

Add an elegant recommendations section below the main product details that displays 3 random similar plants. The similarity will be determined primarily by category, with fallback to random products if there aren't enough products in the same category.

## What You'll Get

- **"You Might Also Like" section** positioned below the main product details
- **3 product cards** displayed in a responsive grid
- **Smart selection logic**: First prioritizes products in the same category, then fills remaining slots with random products
- **Excludes the current product** from recommendations
- **Elegant design** matching the existing aesthetic with subtle animations

## Design Preview

```text
+--------------------------------------------------+
|  [Product Image]    |  Product Name              |
|                     |  $XX.XX                    |
|                     |  Description...            |
|                     |  [Buy on PalmStreet]       |
+--------------------------------------------------+
|                                                  |
|        ~ You Might Also Like ~                   |
|                                                  |
|   [Card 1]      [Card 2]      [Card 3]          |
|   Similar       Similar       Random             |
|   Plant         Plant         Plant              |
+--------------------------------------------------+
```

---

## Technical Details

### File to Modify

| File | Changes |
|------|---------|
| `src/pages/ProductDetail.tsx` | Add second query for similar products, render recommendations section |

### Implementation Approach

**1. Add a second React Query to fetch similar products:**

```tsx
const { data: similarProducts } = useQuery({
  queryKey: ['similar-products', id, product?.category],
  queryFn: async () => {
    // Fetch products in same category first
    const { data: sameCategoryProducts } = await supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', id)
      .limit(10);

    // If we need more products, fetch from other categories
    let candidates = sameCategoryProducts || [];
    
    if (candidates.length < 3) {
      const { data: otherProducts } = await supabase
        .from('products')
        .select('*')
        .neq('id', id)
        .neq('category', product.category)
        .limit(10);
      
      candidates = [...candidates, ...(otherProducts || [])];
    }

    // Shuffle and pick 3 random products
    const shuffled = candidates.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  },
  enabled: !!product,
});
```

**2. Add the recommendations section UI:**

```tsx
{/* You Might Also Like Section */}
{similarProducts && similarProducts.length > 0 && (
  <section className="mt-16 border-t pt-12">
    <div className="text-center mb-8">
      <span className="text-accent font-medium text-sm tracking-wider uppercase">
        Discover More
      </span>
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-2">
        You Might Also Like
      </h2>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {similarProducts.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          index={index}
          isInView={true}
        />
      ))}
    </div>
  </section>
)}
```

### Selection Logic

| Priority | Source | Description |
|----------|--------|-------------|
| 1st | Same Category | Products with matching category (e.g., both "aroids") |
| 2nd | Other Categories | Random products from other categories if needed |
| Final | Shuffle | Randomly shuffle candidates and pick top 3 |

### Key Features

- **Reuses ProductCard component** for consistent styling
- **Excludes current product** to avoid showing the same item
- **Gracefully handles edge cases**:
  - If fewer than 3 products exist, shows what's available
  - If no other products exist, section is hidden
- **Randomized on each page load** for variety
- **Staggered animation** on cards for polish

### Responsive Grid

- **Mobile (< 640px)**: Single column
- **Tablet (640px+)**: Two columns  
- **Desktop (1024px+)**: Three columns

This creates a natural discovery flow, encouraging customers to explore more plants after viewing a product.

