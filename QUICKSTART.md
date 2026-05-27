# Essy Homecare Website — Quick Start Guide

## 🚀 Getting Started

### Step 1: Set Up Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your credentials:**
   - Project URL: `https://[project-id].supabase.co`
   - Anon Key: (found in Settings → API)
   - Service Role Key: (found in Settings → API)
3. **Create the database tables** — Run the SQL from `SUPABASE_SCHEMA.md` in the SQL Editor

### Step 2: Configure Environment Variables

**Frontend** — Create `frontend/.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:5000
```

**Backend** — Create `backend/.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_STORAGE_BUCKET=uploads
JWT_SECRET=your-secret-key-here-min-32-chars
NODE_ENV=development
PORT=5000
RESEND_API_KEY=your-resend-api-key-optional
FROM_EMAIL=no-reply@essyhomecare.com
ADMIN_EMAIL=admin@essyhomecare.com
```

### Step 3: Install Dependencies & Run Dev Servers

**Terminal 1 — Frontend:**
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

**Terminal 2 — Backend:**
```bash
cd backend
npm install
npm run dev
# Backend running on http://localhost:5000
```

### Step 4: Create Admin User

1. Go to your Supabase dashboard → Authentication → Users
2. Click "Invite" and add a user with your email
3. Confirm the email invite
4. In the user metadata, add:
   ```json
   {
     "role": "admin"
   }
   ```

---

## 📋 Features Implemented

✅ **Frontend:**
- React.js + React Router v6 navigation
- 8 pages: Home, About, Services, Coverage, Referrals, Careers, Contact, Admin
- Responsive design with Tailwind CSS
- Essy brand colors applied throughout
- Form validation with React Hook Form + Zod
- Protected admin routes

✅ **Backend:**
- Express.js REST API
- Authentication middleware with JWT
- Routes for referrals, jobs, applications, contacts
- Admin stats endpoint
- CORS enabled for frontend

✅ **SEO:**
- robots.txt ✓
- sitemap.xml ✓
- Meta tags in HTML ✓
- Semantic HTML structure ✓

---

## 🔌 API Endpoints (All `/api` prefix)

### Public
- `POST /referrals` — Submit referral
- `GET /jobs` — Get job listings
- `POST /applications` — Submit job application
- `POST /contacts` — Submit contact form

### Admin Protected
- `GET /referrals` — View all referrals
- `PATCH /referrals/:id` — Update referral status
- `GET /admin/stats` — Dashboard statistics
- `GET /admin/contacts` — View contact submissions

---

## 🔐 Authentication Setup

Admin login requires:
1. Supabase Auth user with `admin` role in metadata
2. Frontend sends credentials to Supabase
3. Backend validates JWT token from Supabase

**To create admin page:**
- Create `frontend/src/pages/AdminLogin.tsx`
- Use Supabase Auth to authenticate
- Store session in Supabase Auth state
- Protected route checks for session

---

## 📧 Next Steps to Complete

### High Priority
1. **Supabase RLS Policies** — Restrict data access by role
2. **Admin Login Page** — Create authentication UI
3. **Email Integration** — Resend API for notifications
4. **Form API Integration** — Connect frontend forms to backend

### Medium Priority
5. **File Uploads** — Resume/document handling via Supabase Storage
6. **Error Handling** — Better error messages and validation
7. **Search & Filter** — Referral table search on admin dashboard

### Nice to Have
8. **Google Analytics** — Replace `GA_MEASUREMENT_ID` in index.html
9. **Export to CSV** — Admin referral export
10. **Batch Emails** — Send updates to multiple referral contacts

---

## 📝 Form Submissions Currently Mock

These forms collect data but don't yet submit to backend:
- Referral form (ReferralsPage.tsx)
- Contact form (ContactPage.tsx)
- Job application (CareersPage.tsx)

**To enable:**
1. Uncomment API calls in form components
2. Ensure backend is running
3. Check CORS settings

---

## 🎨 Customization

### Brand Colors (Tailwind)
Located in `frontend/tailwind.config.js`:
- Primary (dark navy): `#1A2A3B`
- Teal: `#4BBDCC`
- Green (CTA): `#7DC242`
- Orange (secondary): `#F5821F`

### Content Updates
- Company info: Update in components/layout/Footer.tsx
- Services: ServicesPage.tsx and components/ServicesGrid.tsx
- Coverage areas: CoveragePage.tsx

---

## 🚢 Deployment

### Frontend to Vercel
```bash
cd frontend
npm run build
# Commit and push to GitHub
# Connect to Vercel — auto-deploys from main branch
```

### Backend to Railway/Render
```bash
cd backend
npm run build
# Push to GitHub
# Connect Railway/Render repo — auto-deploys from main
# Set environment variables in dashboard
```

---

## 🐛 Troubleshooting

**Port 5173 already in use:**
```bash
npm run dev -- --port 5174
```

**Supabase connection failed:**
- Check `.env` credentials
- Verify Supabase project is active
- Test with API key in Postman

**CORS errors:**
- Backend CORS origin should match frontend URL
- Check `backend/src/server.ts` cors config

---

## 📚 Resources

- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [React Hook Form Docs](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)

---

**Questions?** Check `README.md` for full project documentation.
