# Shop Approval Fix - Summary

## Issue
Shops were being displayed on the frontend/mainpage before the "Aprovar" (Approve) button was pressed in the admin/super panel.

## Root Cause
The `/api/stores` GET endpoint (when listing all stores) was not filtering by the `approved` status. It was returning ALL restaurants regardless of whether they had been approved or not.

## Solution
Added `WHERE approved = true` filters to the `/api/stores` GET endpoint in `app/api/stores/route.ts` to ensure only approved shops are accessible to the public. Additionally, implemented an `admin` query parameter to allow restaurant owners to access their admin panel even when not approved.

### Changed Files
1. **`app/api/stores/route.ts`**: 
   - Added `isAdminAccess` parameter check (line 9)
   - Modified slug lookup to conditionally check approval status (lines 26-53)
   - When `admin=true` is passed, approval check is bypassed
   - When `admin=true` is NOT passed, only approved stores are returned
   - Modified id lookup to check approval status (line 71)
   - Modified list all stores to check approval status (line 94)

2. **`app/admin/[slug]/page.tsx`**:
   - Updated restaurant fetch to include `admin=true` parameter (line 34)
   - This allows restaurant owners to access their admin panel even if not approved

### Security Enhancement
The fix prevents three potential issues:
1. **Main page listing**: Unapproved shops no longer appear in the store list
2. **Direct URL access**: Users cannot bypass the approval system by directly visiting `/loja/[slug]` for unapproved shops
3. **Admin panel access**: Restaurant owners can still access their admin panel (`/admin/[slug]`) to manage products and settings while waiting for approval

## Behavior After Fix

### Frontend (Main Page)
- **Before**: All registered shops appeared on the main page immediately after registration
- **After**: Only shops that have been approved via the admin/super panel will appear on the main page

### Admin Panel (`/admin/super`)
- **Unchanged**: Super admin can still see ALL restaurants (both approved and pending)
- The "Aprovar" button toggles the `approved` status
- When approved, the shop becomes visible on the frontend

## Testing Recommendations
1. Register a new shop via `/register`
2. Verify it does NOT appear on the main page (`/`)
3. **Try to access the shop directly** by visiting `/loja/[slug]` (should show "Restaurant not found")
4. Login to super admin panel (`/admin/super`)
5. Verify the new shop appears with "PENDENTE" status
6. Click "Aprovar" button
7. Verify the shop now appears on the main page (`/`)
8. **Try to access the shop directly** by visiting `/loja/[slug]` (should now work)
9. Click "Pausar" button to unapprove
10. Verify the shop disappears from the main page
11. **Try to access the shop directly again** (should show "Restaurant not found")

## Related Endpoints
- `/api/stores` - Now filters by `approved = true` for public listing
- `/api/restaurants?all=true` - Returns all restaurants (used by admin panel)
- `/api/restaurants` (default) - Already filtered by `approved = true`
