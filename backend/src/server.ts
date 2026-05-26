import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { authenticateToken } from './middleware/auth.js'

// Route imports
import referralRoutes from './routes/referrals.js'
import jobRoutes from './routes/jobs.js'
import applicationRoutes from './routes/applications.js'
import contactRoutes from './routes/contacts.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://essyhomecare.vercel.app'
]

console.log('Backend CORS allowed origins:', allowedOrigins)

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowed = !origin || allowedOrigins.includes(origin)
    console.log(`CORS check for origin: ${origin || 'no origin'} -> ${allowed ? 'allowed' : 'blocked'}`)

    if (allowed) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/referrals', referralRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/admin', authenticateToken, adminRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
})
