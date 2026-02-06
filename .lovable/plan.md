

# PalmStreet Bulk Import Feature

## Overview

This plan adds a bulk import feature to quickly import multiple plant products from PalmStreet URLs. The system will scrape each URL to extract the product name, price, and image, then save them to your products database.

## How It Will Work

1. On the admin Products page, you'll see a new "Import from PalmStreet" button
2. Clicking it opens a dialog where you can paste multiple PalmStreet URLs (one per line)
3. Click "Import" to process all links - the system will:
   - Scrape each PalmStreet page to extract product details
   - Create products with the name, price, image, and link back to PalmStreet
4. A progress indicator shows which links are being processed
5. Successfully imported products appear in your products list

## Requirements

This feature requires the **Firecrawl connector** to scrape PalmStreet pages (they use heavy JavaScript rendering that simple fetch requests cannot handle). The connector will need to be set up before use.

---

## Technical Details

### 1. Connect Firecrawl

Set up the Firecrawl connector to enable web scraping capabilities. This provides the API key needed to scrape JavaScript-rendered pages like PalmStreet.

### 2. Create Backend Function

Create a new edge function `palmstreet-scrape` that:
- Accepts a PalmStreet URL
- Uses Firecrawl to scrape the page
- Extracts product data (name, price, image URL) from the page content
- Returns structured product data

```text
supabase/functions/palmstreet-scrape/index.ts
```

The function will:
- Validate the URL is a PalmStreet link
- Call Firecrawl API to scrape the page with JavaScript rendering
- Parse the response to extract product details
- Return structured JSON with name, price, and image_url

### 3. Create API Helper

Add a helper function to call the scrape endpoint:

```text
src/lib/api/palmstreet.ts
```

### 4. Create Import Dialog Component

Build a new dialog component for bulk importing:

```text
src/components/admin/PalmStreetImportDialog.tsx
```

Features:
- Large textarea for pasting multiple URLs (one per line)
- Import button with loading state
- Progress indicator showing current/total
- Success/error feedback for each URL
- Summary of imported products

### 5. Update Admin Products Page

Modify the admin products page to include:
- New "Import from PalmStreet" button in the header
- Integration with the import dialog

```text
src/pages/admin/AdminProducts.tsx
```

### Component Structure

```text
+--------------------------------------------------+
|  Products                                         |
|  Manage your plant inventory                      |
|                                                   |
|  [+ Add Product]  [Import from PalmStreet]        |
+--------------------------------------------------+
|                                                   |
|  (Product Table)                                  |
|                                                   |
+--------------------------------------------------+

Import Dialog:
+--------------------------------------------------+
|  Import from PalmStreet                     [X]  |
+--------------------------------------------------+
|                                                   |
|  Paste PalmStreet product URLs (one per line):   |
|  +----------------------------------------------+|
|  | https://palmstreet.app/product/abc123        ||
|  | https://palmstreet.app/product/def456        ||
|  | https://palmstreet.app/product/ghi789        ||
|  +----------------------------------------------+|
|                                                   |
|  Progress: 2/3 imported                          |
|  [==========----------] 66%                      |
|                                                   |
|  [Cancel]                        [Import All]    |
+--------------------------------------------------+
```

### Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `supabase/functions/palmstreet-scrape/index.ts` | Create | Backend scraping logic |
| `src/lib/api/palmstreet.ts` | Create | Frontend API helper |
| `src/components/admin/PalmStreetImportDialog.tsx` | Create | Import UI component |
| `src/pages/admin/AdminProducts.tsx` | Modify | Add import button |

