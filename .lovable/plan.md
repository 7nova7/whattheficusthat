
# 🌿 Whattheficusthat - Updated Website Plan

## Overview
A stunning, greenhouse-inspired website for Eva's licensed plant nursery. Products will be beautifully displayed and link directly to PalmStreet for purchases — keeping your existing sales workflow while adding a branded web presence.

---

## 🎨 Design System (Already Configured)

**Color Palette:**
- Deep Forest Green (#1B4332) - Primary brand color
- Sage Green (#95D5B2) - Accents & highlights  
- Cream (#FEFAE0) - Backgrounds
- Terracotta (#C38154) - Warm accents & CTAs
- Soft Gold (#E9C46A) - Premium touches
- Charcoal (#1A1A1A) - Text

**Typography:**
- Headings: Playfair Display (elegant serif)
- Body: DM Sans (clean, readable)

---

## 📱 Pages & Features

### 1. Homepage
**Hero Section:**
- Full-width botanical background
- "Whattheficusthat" in playful serif font
- Tagline: "Your Plant Plug — Rare & Exotic Plants, Shipped to Your Door"
- CTA buttons: "Shop Plants" and "Watch Live"

**Trust Bar:**
- 5-Star Rating | 1,900+ Sales | 415+ Reviews | 2,600+ Followers

### 2. About Eva Section
- Warm personal introduction
- Review badges: "Great Packaging," "Quick Shipper," etc.
- Fade-in animations on scroll

### 3. Shop / Product Catalog (Updated Approach)
**Display:**
- Beautiful grid of plants with images, names, prices
- Category filter tabs: All Plants, Rare Finds, Aroids, Hoyas, Beginner Friendly
- Gentle hover animations on product cards

**Linking to PalmStreet:**
- Each product card has a "Buy on PalmStreet" button
- Button links to the specific product on PalmStreet (or your main store if no specific link)
- Products stored in database so Eva can manage them via admin dashboard
- Each product can have an optional `palmstreet_url` field for direct linking

**Sample Products:**
- Amazonica Pink Variegated Corm — $75 → Links to PalmStreet
- Monstera Thai Constellation — $120 → Links to PalmStreet
- Philodendron Pink Princess — $65 → Links to PalmStreet

### 4. Live Stream Section
- "Watch Eva Live!" heading with schedule
- Countdown timer to next live event
- "Follow on PalmStreet" CTA button
- Moody greenhouse-style background

### 5. Reviews & Testimonials
- Card carousel with customer reviews
- Aggregate stats and badge cloud

### 6. Shipping Information
- Clean info cards explaining shipping options
- "We pack with care" messaging

### 7. Contact & Newsletter
- Functional contact form (saves to database)
- Newsletter signup (saves subscribers)
- Social links to Instagram & PalmStreet

### 8. Footer
- Business info, quick links, social icons

---

## 🔧 Admin Dashboard (for Eva)

**Secure Login:**
- Email/password authentication
- Admin-only access

**Product Management:**
- Add/edit/delete plants
- Fields: name, price, description, category, image, PalmStreet URL
- Set availability status (available/sold out)
- Upload product images

**Subscriber & Contact Management:**
- View newsletter subscribers
- View contact form submissions

---

## ⚙️ Backend Requirements

**Database Tables:**
- `products` - Plant inventory with PalmStreet links
- `newsletter_subscribers` - Email list
- `contact_submissions` - Form messages
- `profiles` - User roles (admin for Eva)

**File Storage:**
- Product images stored in cloud storage

**No Longer Needed:**
- ~~Stripe integration~~
- ~~Shopping cart~~
- ~~Checkout flow~~
- ~~Orders table~~

---

## 📲 Mobile-First Design
- Sticky header with hamburger menu
- Stacked layouts for mobile
- Thumb-friendly "Buy on PalmStreet" buttons
- Touch-friendly product browsing

---

## ✨ Animations & Polish
- Smooth scroll between sections
- Fade-in animations on scroll
- Gentle hover effects on products
- Button hover transitions
- Toast notifications for form submissions

---

## 🚀 Implementation Order

1. **Database Setup** - Create products, subscribers, and contacts tables
2. **Homepage** - Hero, trust bar, about section, reviews, shipping info
3. **Product Catalog** - Grid with filters, PalmStreet links
4. **Live Stream Section** - Schedule and countdown timer
5. **Contact & Newsletter** - Functional forms
6. **Admin Dashboard** - Product management, subscriber views
7. **Polish** - Animations, mobile optimization, final touches

---

## Benefits of This Approach

- **Simpler setup** - No payment processing complexity
- **Keeps your workflow** - PalmStreet handles all transactions
- **Branded presence** - Beautiful storefront that tells your story
- **Full control** - Manage your product display via admin dashboard
- **Drive traffic** - Funnels visitors to your PalmStreet store
