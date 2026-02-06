

# Plan: Fix Admin Dashboard Race Condition

## Root Cause Analysis

The admin dashboard redirect happens due to a timing issue between authentication and role checking:

1. **Initial State**: When the page loads, `user` is `null` (auth is loading)
2. **useAdminCheck Called**: `useAdminCheck(undefined)` is called because `user?.id` is `undefined`
3. **Premature Result**: The hook immediately sets `isAdmin = false` and `loading = false` when `userId` is undefined
4. **Race Condition**: The redirect useEffect sees `adminLoading = false` and `isAdmin = false`, triggering a redirect to homepage
5. **Too Late**: By the time auth loads and the correct `userId` is available, you've already been redirected

## Solution

The fix requires ensuring that `useAdminCheck` does NOT set `loading = false` until we actually know whether we have a user or not. We need to coordinate the loading states properly.

### Approach: Keep adminLoading true until auth is resolved

Instead of having `useAdminCheck` immediately return when `userId` is undefined, we need to:

1. **Option A**: Pass `authLoading` to `useAdminCheck` so it knows to wait
2. **Option B**: Only call `useAdminCheck` after auth has finished loading (cleaner)

I'll implement **Option B** - restructure the logic so the admin check only starts after we have confirmed auth state.

## Files to Modify

```text
src/hooks/useAdminCheck.ts
└── Return loading=true when userId is undefined (don't immediately resolve)

src/components/admin/AdminLayout.tsx  
└── Add additional guard to only redirect when we're certain about auth state
```

## Technical Implementation

### useAdminCheck.ts Changes

```typescript
// Current problematic behavior:
if (!userId) {
  setIsAdmin(false);
  setLoading(false);  // This causes the race condition!
  return;
}

// Fixed behavior:
if (!userId) {
  setIsAdmin(false);
  // Keep loading = true until we get a real userId
  // The parent component should handle the "no user" case
  return;
}
```

Wait, this won't work either because then `loading` would never become false for unauthenticated users.

**Better approach**: The real fix is in `AdminLayout.tsx`. We need to ensure we don't trigger the non-admin redirect until BOTH:
- `authLoading` is false (auth finished)
- If there IS a user, `adminLoading` must also be false

Currently the hook sets `loading=false` immediately when `userId` is undefined. The fix is to track whether the admin check was actually performed vs just skipped.

### Revised Solution

Create a more robust state machine:

1. **useAdminCheck** will return an additional flag: `checked: boolean` - indicates whether a check was actually performed
2. **AdminLayout** will use this to know if it should trust `isAdmin`

Actually, the cleanest fix is simpler - we just need to ensure `useAdminCheck` keeps `loading: true` until a real check happens, and only return `loading: false` with `isAdmin: false` when we actually query the database.

### Final Approach

Modify `useAdminCheck` to:
- Only set `loading: false` AFTER making the actual RPC call
- When `userId` is undefined, keep `loading: true` (because we're waiting for auth to give us a userId)

This means unauthenticated users will see the loading spinner until `AdminLayout`'s auth redirect kicks them to login.

## Implementation Details

### useAdminCheck.ts

```typescript
export function useAdminCheck(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Reset loading state when userId changes
    setLoading(true);
    
    async function checkAdminRole() {
      if (!userId) {
        // Don't set loading to false - let the auth system handle this
        // The AdminLayout will redirect to login if there's no user
        return;
      }

      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: userId,
          _role: 'admin',
        });

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data === true);
        }
      } catch (err) {
        console.error('Error checking admin role:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdminRole();
  }, [userId]);

  return { isAdmin, loading };
}
```

### AdminLayout.tsx

Update the render logic to be clearer:

```typescript
// Show loading while auth OR admin check is in progress
if (authLoading || (user && adminLoading)) {
  return <LoadingSpinner />;
}

// If no user after auth completes, redirect will happen via useEffect
if (!user) {
  return null;
}

// If user exists but is not admin, redirect will happen via useEffect  
if (!isAdmin) {
  return null;
}

// User is authenticated and is admin - show dashboard
return <AdminDashboard />;
```

## Expected Behavior After Fix

1. Navigate to `/admin`
2. See loading spinner while auth checks session
3. If no user → redirect to `/admin/login`
4. If user exists → loading spinner continues while admin role is checked
5. If admin → dashboard appears
6. If not admin → redirect to homepage

