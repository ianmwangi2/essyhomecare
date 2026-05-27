# Admin Authentication Flow Verification

## Overview

This document outlines the complete admin authentication flow for Essy Homecare and details the verification performed on the system.

## ✅ Verification Results

### 1. **Supabase Login Integration**

**Status:** ✅ VERIFIED & WORKING

**Details:**
- Frontend uses `supabase.auth.signInWithPassword()` in `AdminLoginPage.tsx`
- Backend validates tokens against Supabase Auth API via fetch to `/auth/v1/user`
- Environment variables properly configured:
  - `SUPABASE_URL` - Backend Supabase URL
  - `SUPABASE_SERVICE_KEY` - Backend service role key
  - `VITE_SUPABASE_URL` - Frontend Supabase URL
  - `VITE_SUPABASE_ANON_KEY` - Frontend anonymous key

**Validation Flow:**
```
1. User enters email/password on AdminLoginPage
2. Frontend calls supabase.auth.signInWithPassword()
3. Supabase returns access_token and user object
4. Frontend checks user.user_metadata.role === 'admin'
5. If admin, redirects to /admin dashboard
6. AdminDashboard makes API calls with Bearer token
7. Backend middleware validates token against Supabase
8. Token is valid, user extracted with role
```

### 2. **Admin Role Assignment**

**Status:** ✅ VERIFIED & ENHANCED

**Details:**
- Role is stored in Supabase `user.user_metadata.role`
- Backend reads from both `user_metadata` and `app_metadata` for compatibility
- **NEW:** Added `/api/admin/users/:userId/assign-admin` endpoint to programmatically assign roles
- **NEW:** Added `/api/admin/users/:userId/remove-admin` endpoint to revoke roles
- **NEW:** Added `/api/admin/users` endpoint to list all admin users

**How to Assign Admin Role:**

**Method 1: Using Setup Script (Recommended for initial admin)**
```bash
ADMIN_EMAIL=admin@essyhomecare.com ADMIN_PASSWORD=<secure-password> npm run setup-admin
```

**Method 2: Using API Endpoint (For assigning additional admins)**
```bash
curl -X POST http://localhost:5000/api/admin/users/{userId}/assign-admin \
  -H "Authorization: Bearer {admin-access-token}" \
  -H "Content-Type: application/json"
```

**Method 3: Supabase Dashboard**
1. Go to Supabase Dashboard > Authentication > Users
2. Click on the user
3. Click "Edit user" in the top-right
4. Find "Auth metadata"
5. Add to `User metadata`:
   ```json
   {
     "role": "admin"
   }
   ```
6. Save changes

### 3. **Admin Login Page**

**Status:** ✅ VERIFIED & WORKING

**Location:** `frontend/src/pages/AdminLoginPage.tsx`

**Features:**
- ✅ Email/password login form
- ✅ Form validation
- ✅ Error handling and display
- ✅ Role verification (checks if user has admin role)
- ✅ Sign-out on non-admin access attempt
- ✅ Password reset functionality
- ✅ Professional UI with Essy Homecare branding

**Flow:**
1. User navigates to `/admin-login`
2. Enters email and password
3. System verifies credentials with Supabase
4. System checks if user has `role: 'admin'`
5. If admin: Redirects to `/admin`
6. If not admin: Displays error, signs user out

## 🔐 Security Improvements Made

### 1. **Enhanced ProtectedRoute Component**

**Previous Issue:** ProtectedRoute only checked if user was authenticated, not if they had admin role.

**Fix Applied:**
- Now validates admin role on initial load
- Validates admin role on every auth state change
- Signs out and redirects to login if role changes
- Prevents unauthorized access to admin panel

**File Modified:** `frontend/src/components/auth/ProtectedRoute.tsx`

### 2. **New Admin Management Endpoints**

**Added Endpoints:**

**POST /api/admin/users/:userId/assign-admin**
- Assigns admin role to a user
- Requires existing admin authentication
- Response: `{ message, user: { id, email, role } }`

**POST /api/admin/users/:userId/remove-admin**
- Removes admin role from a user
- Requires existing admin authentication
- Response: `{ message, user: { id, email, role } }`

**GET /api/admin/users**
- Lists all users with admin role
- Requires existing admin authentication
- Response: `{ total_users, admin_users: [] }`

**File Modified:** `backend/src/routes/admin.js`

## 🚀 Setup Instructions

### For First-Time Setup

1. **Create initial admin user:**
   ```bash
   cd backend
   ADMIN_EMAIL=admin@essyhomecare.com ADMIN_PASSWORD=YourSecurePassword npm run setup-admin
   ```

2. **Start the backend:**
   ```bash
   npm run dev
   ```

3. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Log in to admin panel:**
   - Navigate to `http://localhost:5173/admin-login`
   - Enter the email and password from step 1
   - You should be redirected to `/admin`

### For Adding Additional Admins

**Option A: Using API (if you're already logged in as admin)**
```bash
curl -X POST http://localhost:5000/api/admin/users/{user-id}/assign-admin \
  -H "Authorization: Bearer {your-admin-token}" \
  -H "Content-Type: application/json"
```

**Option B: Using Supabase Dashboard**
1. Go to Supabase > Authentication > Users
2. Find the user
3. Click "Edit user"
4. Add `{ "role": "admin" }` to User metadata
5. Save

## 🔍 Testing the Auth Flow

### Test 1: Verify Admin Login Works
```bash
# Navigate to admin login
# Enter credentials
# Should redirect to /admin dashboard
```

### Test 2: Verify Non-Admin Cannot Access
```bash
# Create a test user without admin role
# Try to log in with that user
# Should see error: "Admin access is required for this portal"
```

### Test 3: Verify Protected Routes
```bash
# Copy admin dashboard URL
# Open in incognito/private window
# Try to access /admin without logging in first
# Should redirect to /admin-login
```

### Test 4: Verify Admin Endpoints
```bash
# Get admin token from logged-in admin
# Test GET /api/admin/stats
# Should return stats, not 403 error
```

## 📋 Auth Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Admin User                                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
         ┌──────────────────────────┐
         │  AdminLoginPage.tsx       │
         │  - Email input            │
         │  - Password input         │
         │  - Validate role          │
         └──────────┬───────────────┘
                    │
                    ▼
      ┌────────────────────────────────────┐
      │  supabase.auth.signInWithPassword() │
      │  - Calls Supabase Auth API          │
      │  - Returns access_token             │
      │  - Returns user object              │
      └──────────┬─────────────────────────┘
                 │
    ┌────────────┴───────────────┐
    │ Check user_metadata.role    │
    └────┬───────────────────┬────┘
         │ admin             │ not admin
         ▼                   ▼
    Redirect to        Show error,
    /admin             sign out
         │
         ▼
    ┌──────────────────────────────┐
    │  ProtectedRoute              │
    │  - Check session exists      │
    │  - Verify admin role ✅ NEW  │
    │  - Redirect to login if no   │
    └────┬─────────────────────────┘
         │
         ▼
    ┌──────────────────────────────┐
    │  AdminDashboard              │
    │  - Make API requests         │
    │  - Include Bearer token      │
    └────┬─────────────────────────┘
         │
         ▼
    ┌──────────────────────────────┐
    │  Backend API (/api/admin/*)  │
    │  - authenticateToken         │
    │  - Validate token w/ Supabase│
    │  - requireAdmin middleware   │
    │  - Check role === 'admin'    │
    │  - Serve protected resource  │
    └──────────────────────────────┘
```

## 📚 Key Files

| File | Purpose |
|------|---------|
| `frontend/src/pages/AdminLoginPage.tsx` | Admin login UI |
| `frontend/src/components/auth/ProtectedRoute.tsx` | Admin route protection (UPDATED) |
| `frontend/src/pages/AdminDashboard.tsx` | Admin dashboard |
| `frontend/src/lib/api.ts` | API client with token injection |
| `backend/src/middleware/auth.js` | Token validation & role checking |
| `backend/src/routes/admin.js` | Admin API endpoints (ENHANCED) |
| `backend/src/scripts/setup-admin.js` | Admin user initialization (NEW) |

## 🛠️ Troubleshooting

### "Admin access is required for this portal"
- **Cause:** User logged in but doesn't have admin role
- **Solution:** Use setup script or Supabase dashboard to assign role

### "Invalid or expired token"
- **Cause:** Backend cannot validate token against Supabase
- **Solution:** Check `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` env vars

### "Cannot read property 'role' of undefined"
- **Cause:** User metadata not set when creating user
- **Solution:** Use setup script or ensure `user_metadata` is set in Supabase

### API returns 403 Forbidden
- **Cause:** Token doesn't have admin role
- **Solution:** Verify user has admin role in Supabase, retry with new token

## ✨ Summary of Changes

1. ✅ **ProtectedRoute** - Now enforces admin role check
2. ✅ **Admin Routes** - Added `/assign-admin`, `/remove-admin`, `/users` endpoints
3. ✅ **Setup Script** - New script to initialize first admin
4. ✅ **Documentation** - Complete auth flow documentation

All changes maintain backward compatibility and follow existing code patterns.
