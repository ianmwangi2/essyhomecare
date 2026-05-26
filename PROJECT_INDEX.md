# Project File Structure & Index

```
essyhomecare/
│
├── 📄 README.md                 # Main project documentation
├── 📄 SETUP.md                  # Complete setup instructions (START HERE!)
├── 📄 QUICKSTART.md             # Quick reference guide
├── 📄 SUPABASE_SCHEMA.md        # Database schema and RLS policies
│
├── 🎨 frontend/
│   ├── 📄 package.json          # Frontend dependencies
│   ├── 📄 tsconfig.json         # TypeScript config
│   ├── 📄 vite.config.ts        # Vite bundler config
│   ├── 📄 tailwind.config.js    # Tailwind CSS theme
│   ├── 📄 postcss.config.js     # PostCSS config
│   ├── 📄 .eslintrc.cjs         # ESLint config
│   ├── 📄 .env.example          # Environment template
│   ├── 📄 .gitignore            # Git ignore rules
│   │
│   ├── 📁 public/
│   │   ├── 📄 index.html        # HTML entry point (includes Google Analytics)
│   │   ├── 📄 robots.txt        # SEO robots directive
│   │   └── 📄 sitemap.xml       # SEO sitemap
│   │
│   └── 📁 src/
│       ├── 📄 main.tsx          # React entry point
│       ├── 📄 App.tsx           # Main router component
│       ├── 📄 index.css         # Global Tailwind styles
│       │
│       ├── 📁 lib/              # Utility libraries
│       │   ├── 📄 supabase.ts   # Supabase client initialization
│       │   └── 📄 api.ts        # Axios HTTP client with auth
│       │
│       ├── 📁 types/            # TypeScript types
│       │   └── 📄 index.ts      # Referral, Job, Application, Contact interfaces
│       │
│       ├── 📁 components/       # React components
│       │   ├── 📁 auth/
│       │   │   └── 📄 ProtectedRoute.tsx    # Admin route protection
│       │   ├── 📁 layout/
│       │   │   ├── 📄 Layout.tsx            # Main layout wrapper
│       │   │   ├── 📄 Navbar.tsx            # Navigation bar
│       │   │   └── 📄 Footer.tsx            # Footer component
│       │   ├── 📄 ServicesGrid.tsx          # 6-service card grid
│       │   └── 📄 TrustBadges.tsx           # Trust badges display
│       │
│       └── 📁 pages/            # Page components (routes)
│           ├── 📄 HomePage.tsx              # / (Hero, services, coverage teaser)
│           ├── 📄 AboutPage.tsx             # /about (Company history, leadership)
│           ├── 📄 ServicesPage.tsx          # /services (6 detailed services)
│           ├── 📄 CoveragePage.tsx          # /coverage (4 county listings)
│           ├── 📄 ReferralsPage.tsx         # /referrals (Online referral form)
│           ├── 📄 CareersPage.tsx           # /careers (Job listings)
│           ├── 📄 ContactPage.tsx           # /contact (Contact form)
│           ├── 📄 AdminLoginPage.tsx        # /admin-login (Auth page)
│           └── 📄 AdminDashboard.tsx        # /admin (Protected dashboard)
│
├── 🔧 backend/
│   ├── 📄 package.json          # Backend dependencies
│   ├── 📄 tsconfig.json         # TypeScript config
│   ├── 📄 .eslintrc.cjs         # ESLint config
│   ├── 📄 .env.example          # Environment template
│   ├── 📄 .gitignore            # Git ignore rules
│   │
│   └── 📁 src/
│       ├── 📄 server.ts         # Express app entry point
│       │
│       ├── 📁 middleware/       # Express middleware
│       │   └── 📄 auth.ts       # JWT authentication middleware
│       │
│       ├── 📁 schemas/          # Data validation
│       │   └── 📄 validation.ts # Zod schemas for all forms
│       │
│       └── 📁 routes/           # API route handlers
│           ├── 📄 referrals.ts  # GET/POST/PATCH referrals (admin protected)
│           ├── 📄 jobs.ts       # GET jobs, POST/PATCH/DELETE (admin only)
│           ├── 📄 applications.ts # GET (admin), POST applications
│           ├── 📄 contacts.ts   # POST contact forms
│           └── 📄 admin.ts      # GET stats, contacts (admin only)
```

---

## 📖 Navigation Guide

### For Frontend Development
1. **Start here:** `frontend/src/App.tsx` — Main router definition
2. **Layout:** `frontend/src/components/layout/` — Navbar, Footer, Layout
3. **Pages:** `frontend/src/pages/` — Individual page components
4. **Styling:** `frontend/tailwind.config.js` — Brand colors and theme
5. **Types:** `frontend/src/types/index.ts` — Data interfaces

### For Backend Development
1. **Start here:** `backend/src/server.ts` — Express app setup
2. **Routes:** `backend/src/routes/` — API endpoints
3. **Validation:** `backend/src/schemas/validation.ts` — Zod schemas
4. **Auth:** `backend/src/middleware/auth.ts` — JWT validation

### For Database
1. **Schema:** `SUPABASE_SCHEMA.md` — Table definitions and RLS
2. **Setup:** `SETUP.md` — Step-by-step database setup

### For Deployment
1. **Frontend:** Push to GitHub → Connect Vercel → Auto-deploy
2. **Backend:** Push to GitHub → Connect Railway/Render → Auto-deploy
3. **Environment:** Set vars in platform dashboard (Vercel/Railway)

---

## 🎯 Component Relationships

```
App.tsx (Router)
├─ Layout.tsx (Wrapper)
│  ├─ Navbar.tsx
│  ├─ Outlet (Page content)
│  └─ Footer.tsx
│
├─ HomePage.tsx
│  ├─ ServicesGrid.tsx
│  └─ TrustBadges.tsx
│
├─ AboutPage.tsx
├─ ServicesPage.tsx
├─ CoveragePage.tsx
├─ ReferralsPage.tsx (uses api.ts)
├─ CareersPage.tsx (uses api.ts)
├─ ContactPage.tsx (uses api.ts)
│
├─ AdminLoginPage.tsx (uses supabase.ts)
└─ ProtectedRoute
   └─ AdminDashboard.tsx (uses api.ts)
```

---

## 🔄 Data Flow

### Public Referral Submission
1. User fills ReferralsPage.tsx form
2. Form validated with Zod
3. POST to backend `/api/referrals`
4. Backend validates again with Zod schema
5. Data inserted to Supabase `referrals` table
6. Response returned to frontend
7. Success confirmation shown

### Admin Dashboard Access
1. User navigates to `/admin`
2. ProtectedRoute checks Supabase auth
3. If no session → redirect to `/admin-login`
4. User enters credentials on AdminLoginPage.tsx
5. Supabase Auth validates
6. JWT stored in Supabase session
7. ProtectedRoute verifies session exists
8. AdminDashboard.tsx renders with stats and referral table

### API Request with Auth
1. Frontend needs to make authenticated request
2. api.ts axios client checks Supabase session
3. Includes `Authorization: Bearer {jwt}` header
4. Backend auth middleware validates JWT
5. Request proceeds if valid, 403 if invalid

---

## ⚙️ Key Configuration Files

| File | Contains | Purpose |
|------|----------|---------|
| `.env` | Secrets & URLs | Never commit; use `.env.example` |
| `package.json` | Dependencies | npm/yarn install |
| `tsconfig.json` | TypeScript config | Language settings |
| `tailwind.config.js` | CSS theme | Brand colors & design tokens |
| `vite.config.ts` | Build config | Dev server & proxy settings |
| `server.ts` | Express setup | API startup & middleware |

---

## 📊 Technology Summary

| Layer | Tech | Files |
|-------|------|-------|
| Frontend UI | React + TS | `frontend/src/pages/` |
| Routing | React Router v6 | `frontend/src/App.tsx` |
| Styling | Tailwind CSS | `frontend/tailwind.config.js` |
| Forms | React Hook Form + Zod | `frontend/src/pages/*Page.tsx` |
| HTTP | Axios | `frontend/src/lib/api.ts` |
| Database | Supabase PostgreSQL | `SUPABASE_SCHEMA.md` |
| Auth | Supabase Auth | `frontend/src/lib/supabase.ts` |
| Backend | Express.js | `backend/src/server.ts` |
| API Routes | Express Routers | `backend/src/routes/` |
| Validation | Zod | `backend/src/schemas/` |

---

## 🚀 Build & Deploy Commands

```bash
# Frontend build
cd frontend
npm run build
# Creates optimized dist/ for production

# Backend build
cd backend
npm run build
# Creates compiled JavaScript in dist/

# Development
npm run dev  # Both frontend and backend
```

---

## 🔍 File Search Cheat Sheet

Find files by feature:

- **Referral form logic:** `frontend/src/pages/ReferralsPage.tsx`
- **API calls:** `backend/src/routes/referrals.ts`
- **Brand colors:** `frontend/tailwind.config.js` (`:root` section)
- **Auth flow:** `frontend/src/components/auth/ProtectedRoute.tsx`
- **Admin routes:** `frontend/src/App.tsx` (bottom section)
- **Database:** `SUPABASE_SCHEMA.md`
- **Setup steps:** `SETUP.md`

---

**Next step:** Read `SETUP.md` to configure Supabase and run the app locally!
