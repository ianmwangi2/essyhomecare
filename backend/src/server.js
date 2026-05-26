import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { authenticateToken } from './middleware/auth.js'

import referralRoutes from './routes/referrals.js'
import jobRoutes from './routes/jobs.js'
import applicationRoutes from './routes/applications.js'
import contactRoutes from './routes/contacts.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173', 'https://essyhomecare.vercel.app']

console.log('Backend CORS allowed origins:', allowedOrigins)

app.use(cors({ origin: (origin, callback) => {
  const allowed = !origin || allowedOrigins.includes(origin)
  if (allowed) callback(null, true)
  else callback(new Error('Not allowed by CORS'))
}}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Initialize Supabase client for server-side use
export const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '')

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use('/api/referrals', referralRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/admin', authenticateToken, adminRoutes)

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error', message: process.env.NODE_ENV === 'development' ? err.message : undefined })
})

app.listen(PORT, () => console.log(`🚀 Backend server running on http://localhost:${PORT}`))
