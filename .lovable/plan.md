
# Fix Product Card Button Overflow and Redesign Card Layout

## The Problem

When displaying 6 product cards in a row (on large screens), the cards become too narrow and the "Buy on PalmStreet" button text gets cut off. The price and button are competing for horizontal space in a single row, causing the button to overflow.

## Solution Overview

I'll redesign the product card layout to be more elegant and responsive:

1. **Stack the price and button vertically** instead of side-by-side, giving each full width
2. **Shorten the button text** to just "Buy Now" with an icon - cleaner and fits better
3. **Make the button full-width** for a more polished, professional look
4. **Add a subtle hover effect** on the button for better interactivity
5. **Reduce grid to 3 columns max** on homepage for better readability (optional based on preference)

This creates a more professional card design that works at any width.

---

## Technical Details

### File to Modify

| File | Changes |
|------|---------|
| `src/components/home/ProductCard.tsx` | Redesign card footer layout with stacked price/button, shorter button text |
| `src/components/home/ShopSection.tsx` | Optionally reduce max columns from 6 to 4 for better proportions |

### Specific Code Changes

**ProductCard.tsx - New Card Footer Layout:**

```tsx
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
  <span className="font-serif text-xl font-bold text-primary mb-3">
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
```

**ShopSection.tsx - Adjusted Grid (optional):**
- Change `xl:grid-cols-6` to `xl:grid-cols-4` or keep at 6 if preferred

### Visual Result

- Clean, vertically stacked layout with price above button
- Full-width "Buy Now" button that never gets cut off
- Subtle arrow animation on hover
- Works beautifully at any card width
