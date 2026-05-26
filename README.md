# Essy Homecare & Nursing Services — Website

A professional, CHAP-accredited home healthcare agency website built with React, Node.js, and Supabase.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React.js + React Router v6 + TypeScript |
| Backend | Node.js + Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| Deployment | Vercel (frontend) / Railway or Render (backend) |

---

## Project Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone & Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment Variables

**Frontend** (`frontend/.env`):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:5000
```

**Backend** (`backend/.env`):
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-jwt-secret-here
NODE_ENV=development
PORT=5000
```

### 3. Set Up Supabase

1. Create tables using the schema in `SUPABASE_SCHEMA.md`
2. Set up Row-Level Security (RLS) policies
3. Create admin user in Supabase Auth dashboard

### 4. Start Development Servers

**Terminal 1 — Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 — Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

---

## Project Structure

```
essyhomecare/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   └── [feature components]
│   │   ├── pages/
│   │   ├── lib/
│   │   │   ├── supabase.ts
│   │   │   └── api.ts
│   │   ├── types/
│   │   └── index.css
│   ├── public/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── referrals.ts
│   │   │   ├── jobs.ts
│   │   │   ├── applications.ts
│   │   │   ├── contacts.ts
│   │   │   └── admin.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── schemas/
│   │   │   └── validation.ts
│   │   └── server.ts
│   └── package.json
└── README.md
```

---

## API Routes

### Referrals
- `GET /api/referrals` — Get all (admin only)
- `POST /api/referrals` — Submit referral
- `PATCH /api/referrals/:id` — Update status (admin only)

### Jobs
- `GET /api/jobs` — Get active listings
- `POST /api/jobs` — Create job (admin only)
- `PATCH /api/jobs/:id` — Update job (admin only)

### Applications
- `GET /api/applications` — Get all (admin only)
- `POST /api/applications` — Submit application

### Contacts
- `POST /api/contacts` — Submit contact form

### Admin
- `GET /api/admin/stats` — Dashboard stats (admin only)
- `GET /api/admin/contacts` — Contact submissions (admin only)

---

## Brand Colors

```css
--color-primary:    #1A2A3B;   /* Dark navy */
--color-teal:       #4BBDCC;   /* Teal/cyan */
--color-green:      #7DC242;   /* Fresh green */
--color-orange:     #F5821F;   /* Orange */
--color-white:      #FFFFFF;   /* White */
--color-light-gray: #F5F7FA;   /* Light gray */
--color-text:       #2C3E50;   /* Dark text */
--color-text-muted: #6B7280;   /* Muted gray */
```

---

## Features

✅ Full-stack website with modern React UI
✅ Responsive design (mobile-first)
✅ SEO-optimized (robots.txt, sitemap.xml, meta tags)
✅ Admin dashboard with referral management
✅ Online referral form with validation
✅ Job listings and applications
✅ Contact form
✅ Protected admin routes
✅ Supabase authentication
✅ Form validation with Zod

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
npm start
# Deploy to Railway or Render
```

---

## TODO

- [ ] Connect Resend API for email notifications
- [ ] File upload handling (Supabase Storage)
- [ ] Admin login page
- [ ] Export referrals as CSV
- [ ] Batch email notifications
- [ ] Google Analytics integration
- [ ] Search and filtering on referral table
- [ ] Request password reset flow

---

## License

All rights reserved. © 2024 Essy Homecare & Nursing Services
