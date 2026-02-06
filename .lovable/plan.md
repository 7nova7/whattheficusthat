
# Admin Dashboard Implementation Plan

## Overview
Build a secure admin dashboard for Eva to manage her plant inventory, view newsletter subscribers, and read contact form submissions. The dashboard will include email/password authentication with admin role verification.

---

## Features

### 1. Authentication System
- **Login Page** (`/admin/login`)
  - Email and password form with validation
  - Error handling for invalid credentials
  - Redirect to dashboard on successful login
  - Clean, branded login card matching site design

- **Auth Protection**
  - Custom hook to check authentication state
  - Custom hook to verify admin role using the existing `has_role` database function
  - Automatic redirect to login if not authenticated
  - Automatic redirect to homepage if authenticated but not admin

### 2. Admin Dashboard Layout
- **Sidebar Navigation**
  - Dashboard overview link
  - Products management link
  - Newsletter subscribers link
  - Contact submissions link
  - Sign out button

- **Header Bar**
  - "Back to Site" link
  - User email display
  - Sign out button

### 3. Dashboard Home (`/admin`)
- Quick stats cards showing:
  - Total products count
  - Available vs sold out products
  - Newsletter subscriber count
  - Unread contact submissions count

### 4. Product Management (`/admin/products`)
- **Product Table**
  - Columns: Image thumbnail, Name, Price, Category, Status, Actions
  - Sortable and filterable
  - Pagination for large inventories

- **Add Product Form** (Dialog)
  - Name (required)
  - Price (required)
  - Description (optional)
  - Category dropdown (Rare Finds, Aroids, Hoyas, Beginner Friendly, Other)
  - PalmStreet URL (optional)
  - Image upload to cloud storage
  - Availability toggle

- **Edit Product** (Same form, pre-populated)

- **Delete Product**
  - Confirmation dialog before deletion
  - Soft feedback with toast notifications

### 5. Newsletter Subscribers (`/admin/subscribers`)
- **Subscriber Table**
  - Columns: Email, Subscribed Date, Status, Actions
  - Search/filter by email
  - Toggle active/inactive status
  - Pagination

### 6. Contact Submissions (`/admin/contacts`)
- **Submissions Table**
  - Columns: Name, Email, Date, Read Status, Actions
  - Click to view full message in dialog
  - Mark as read/unread toggle
  - Unread count badge in sidebar
  - Pagination

---

## Technical Implementation

### New Files to Create

**Pages:**
- `src/pages/admin/AdminLogin.tsx` - Login form page
- `src/pages/admin/AdminDashboard.tsx` - Dashboard home with stats
- `src/pages/admin/AdminProducts.tsx` - Product management table + forms
- `src/pages/admin/AdminSubscribers.tsx` - Newsletter subscriber list
- `src/pages/admin/AdminContacts.tsx` - Contact form submissions

**Components:**
- `src/components/admin/AdminLayout.tsx` - Wrapper with sidebar + header
- `src/components/admin/AdminSidebar.tsx` - Navigation sidebar
- `src/components/admin/ProductForm.tsx` - Add/edit product dialog form
- `src/components/admin/ProductTable.tsx` - Products data table
- `src/components/admin/SubscriberTable.tsx` - Subscribers data table
- `src/components/admin/ContactTable.tsx` - Contacts data table
- `src/components/admin/StatsCard.tsx` - Dashboard stat display card
- `src/components/admin/ImageUpload.tsx` - Product image upload component

**Hooks:**
- `src/hooks/useAuth.ts` - Authentication state management
- `src/hooks/useAdminCheck.ts` - Admin role verification

**Route Updates:**
- Update `src/App.tsx` to add all admin routes

### Database Queries Used
- `products` table: full CRUD operations (admin only via RLS)
- `newsletter_subscribers` table: SELECT, UPDATE (admin only via RLS)
- `contact_submissions` table: SELECT, UPDATE (admin only via RLS)
- `has_role()` function: verify admin status

### Image Upload Flow
1. User selects image file
2. Validate file type (jpg, png, webp) and size (max 5MB)
3. Generate unique filename with timestamp
4. Upload to `product-images` bucket in cloud storage
5. Get public URL and save to product record

---

## User Experience

### Login Flow
1. Navigate to `/admin` or click "Admin" in header
2. If not logged in, redirect to `/admin/login`
3. Enter email and password
4. On success, redirect to `/admin` dashboard
5. If not an admin, show error and redirect to homepage

### Product Management Flow
1. View all products in a clean table
2. Click "Add Product" button to open form dialog
3. Fill in details, upload image, save
4. Click edit icon on any row to modify
5. Click delete icon with confirmation to remove
6. Toast notifications confirm all actions

### Mobile Responsiveness
- Sidebar collapses to hamburger menu on mobile
- Tables scroll horizontally on small screens
- Forms adapt to single-column layout
- Touch-friendly button sizes

---

## Security Considerations
- All admin routes check authentication server-side via auth state
- Admin role verified using database `has_role()` function (not client-side storage)
- RLS policies ensure only admins can modify products, view subscribers/contacts
- Image uploads restricted to authenticated admin users via storage policies
