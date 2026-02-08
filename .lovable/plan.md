
# Make the SOLD Ribbon Larger and More Prominent

## Current State

The current "SOLD" ribbon is a small diagonal badge positioned in the top-right corner (`text-xs`, `py-1 px-10`). It's subtle and could be missed at a glance.

## New Design

Transform the ribbon into a large, prominent diagonal banner that spans across the entire product image - impossible to miss.

## Visual Changes

| Element | Before | After |
|---------|--------|-------|
| **Text Size** | `text-xs` (12px) | `text-2xl` (24px) |
| **Padding** | `py-1 px-10` | `py-3 px-20` |
| **Position** | Top corner only | Centered diagonally across image |
| **Width** | ~100px | Full diagonal span (~150%+ width) |

## Technical Details

### File to Modify

| File | Changes |
|------|---------|
| `src/components/home/ProductCard.tsx` | Enlarge the SOLD ribbon to span full image diagonally |

### New Ribbon Implementation

```tsx
{!product.is_available && (
  <>
    {/* Stronger overlay for sold items */}
    <div className="absolute inset-0 bg-black/40" />
    
    {/* Large diagonal SOLD banner spanning full image */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-destructive text-destructive-foreground text-2xl md:text-3xl font-bold py-3 px-20 -rotate-45 shadow-xl tracking-widest w-[150%]  text-center">
        SOLD
      </div>
    </div>
  </>
)}
```

### Key Design Decisions

- **Centered Position**: The banner is now centered on the image rather than tucked in a corner
- **Full-Width Span**: Using `w-[150%]` ensures the ribbon extends beyond the image edges for that classic diagonal banner look
- **Larger Text**: Jumping from `text-xs` to `text-2xl` (with `text-3xl` on larger screens) makes it unmissable
- **Stronger Overlay**: Increased overlay opacity from `from-black/30` to `bg-black/40` for better contrast
- **Wider Tracking**: `tracking-widest` spreads the letters for a more dramatic effect
- **Deeper Shadow**: `shadow-xl` gives the banner more depth and presence

This creates a bold, unmistakable sold indicator that clearly communicates the product is no longer available.
