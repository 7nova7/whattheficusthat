
# Add Elegant "Sold" Badge and Improve Admin Controls

## Overview

The existing `is_available` field already controls product availability, but the current "Sold Out" presentation is basic (dark overlay with white text). I'll redesign the sold state to be more elegant and artistic while also improving the admin panel toggle for clarity.

## What You'll Get

### 1. Elegant "Sold" Display on Shop Page
- **Ribbon-style "SOLD" badge** positioned diagonally in the corner of the product image
- **Subtle grayscale filter** on the image to indicate unavailability without being harsh
- **Softer overlay** that doesn't completely obscure the plant photo
- **Crossed-out price** with original visible but muted, showing it's no longer for sale
- **Disabled button** styled elegantly with "Sold Out" text

### 2. Improved Admin Panel Controls
- Rename toggle label from "Available" to "Mark as Sold" for clarity (inverted logic for intuitive use)
- Add a quick-toggle button directly in the product table for one-click sold status changes
- Visual indicator in the table showing sold items more prominently

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/home/ProductCard.tsx` | Redesign sold state with ribbon badge, grayscale filter, elegant overlay |
| `src/components/admin/ProductTable.tsx` | Add quick-toggle button for sold status in table row |
| `src/components/admin/ProductForm.tsx` | Rename toggle to "Mark as Sold" with clearer description |

### ProductCard.tsx - New Sold State Design

```tsx
{/* Image container with elegant sold treatment */}
<div className="relative aspect-square overflow-hidden">
  <img
    src={imageUrl}
    alt={product.name}
    className={cn(
      "w-full h-full object-cover transition-all duration-500 group-hover:scale-110",
      !product.is_available && "grayscale-[60%] brightness-90"
    )}
  />
  
  {/* Elegant sold ribbon in corner */}
  {!product.is_available && (
    <>
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      
      {/* Diagonal ribbon badge */}
      <div className="absolute top-4 -right-8 bg-red-600 text-white text-xs font-bold py-1 px-10 rotate-45 shadow-lg">
        SOLD
      </div>
    </>
  )}
</div>
```

### ProductTable.tsx - Quick Toggle Button

Add a clickable toggle switch directly in the table's Status column:

```tsx
<TableCell>
  <div className="flex items-center gap-2">
    <Switch
      checked={!product.is_available}
      onCheckedChange={(checked) => handleToggleSold(product.id, checked)}
    />
    <Badge variant={product.is_available ? 'default' : 'destructive'}>
      {product.is_available ? 'Available' : 'Sold'}
    </Badge>
  </div>
</TableCell>
```

### ProductForm.tsx - Clearer Toggle Label

```tsx
<FormItem className="flex items-center justify-between rounded-lg border p-3">
  <div className="space-y-0.5">
    <FormLabel>Mark as Sold</FormLabel>
    <p className="text-sm text-muted-foreground">
      Toggle on when this plant has been sold
    </p>
  </div>
  <FormControl>
    <Switch
      checked={!field.value}
      onCheckedChange={(checked) => field.onChange(!checked)}
    />
  </FormControl>
</FormItem>
```

### Visual Design for Sold Badge

| Element | Style |
|---------|-------|
| **Ribbon Position** | Top-right corner, rotated 45 degrees |
| **Ribbon Color** | Rich red (`bg-red-600`) for visibility |
| **Image Treatment** | 60% grayscale + slightly reduced brightness |
| **Overlay** | Subtle gradient from bottom (black/30 to transparent) |
| **Price** | Crossed out with line-through, muted color |
| **Button** | Shows "Sold Out" text, disabled state |

### Admin Quick-Toggle Flow

1. Admin sees all products in table with toggle switch in Status column
2. Click the switch to instantly toggle sold/available status
3. Optimistic UI update with toast confirmation
4. No need to open edit dialog for simple status changes

This gives you elegant, professional sold indicators on the shop page and convenient one-click admin controls for marking products as sold.
