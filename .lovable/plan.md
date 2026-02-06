
# Plan: Fix Admin Dashboard Access and Add Hidden Admin Link

## Problem Analysis

Based on my investigation:

1. **Current Behavior**: When you navigate to `/admin`, if you're not logged in, you get redirected to `/admin/login`. If you're logged in but the admin check hasn't completed or returns `false`, you get redirected back to the homepage (`/`).

2. **Root Issue**: The `AdminLayout` component has a redirect logic that sends non-admin users to `/` immediately. This can cause issues if there's any timing issue with the admin role check.

3. **Your Request**: Add a hidden admin link that only appears after successfully logging in as an admin on `/admin`.

## Solution

### Part 1: Fix Admin Dashboard Access

I'll improve the `AdminLayout` component to:
- Not redirect to `/` if the admin check is still loading
- Add better error handling and logging for the admin check
- Ensure the redirect only happens after loading is complete

### Part 2: Add Hidden Admin Link

I'll add a discrete admin link to the Footer that:
- Only appears when a user is logged in AND has the admin role
- Uses the existing `useAuth` and `useAdminCheck` hooks
- Is styled subtly so it doesn't distract regular visitors

## Files to Modify

```text
src/components/admin/AdminLayout.tsx
└── Improve redirect logic to wait for loading states

src/components/layout/Footer.tsx  
└── Add conditional admin link for authenticated admins
```

## Technical Details

### AdminLayout Changes
- Keep the loading spinner visible until both `authLoading` AND `adminLoading` are false
- Only redirect to `/` after confirming the user is NOT an admin (not just when `isAdmin` is falsy during loading)

### Footer Changes
- Import `useAuth` and `useAdminCheck` hooks
- Add a conditional "Admin" link that only renders when:
  - `!authLoading && !adminLoading` (loading complete)
  - `user` exists (logged in)
  - `isAdmin` is `true` (has admin role)
- Style it subtly at the bottom of the footer

## Expected Outcome

1. When you're logged in as admin and navigate to `/admin`, you'll see the dashboard
2. A subtle "Admin" link will appear in the footer once you're authenticated as an admin
3. Regular visitors won't see any admin-related UI
