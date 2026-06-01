import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { log } from './lib/logger.js'
import { supabase } from './lib/supabase.js'
import { authenticateToken } from './middleware/auth.js'

import referralRoutes from './routes/referrals.js'
import jobRoutes from './routes/jobs.js'
import applicationRoutes from './routes/applications.js'
import contactRoutes from './routes/contacts.js'
import uploadRoutes from './routes/uploads.js'
import adminRoutes from './routes/admin.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000


const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY']
const missing = required.filter((key) => !process.env[key])
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
}

const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads'

const verifyStorageBucket = async () => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    if (error) {
    log.error('Unable to verify Supabase storage bucket', error.message)

      return
    }

    const exists = Array.isArray(buckets) && buckets.some((bucket) => bucket.name === storageBucket)
    if (!exists) {
      log.warn('Supabase storage bucket missing', { storageBucket })
    } else {
      log.info('Supabase storage bucket exists', { storageBucket })
    }
  } catch (err) {
    log.error('Error verifying Supabase storage bucket', err?.message || err)



  }
}

if (process.env.NODE_ENV !== 'test') {
  verifyStorageBucket()
}

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173', 'https://essyhomecare.vercel.app']
log.info('Backend CORS allowed origins', { allowedOrigins })

app.use((req, res, next) => {
  log.info('Incoming request', { method: req.method, path: req.path, origin: req.headers.origin })
  next()
})

app.use(cors({ origin: (origin, callback) => {
  const allowed = !origin || allowedOrigins.includes(origin)
  if (allowed) callback(null, true)
  else callback(new Error('Not allowed by CORS'))
}}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))



app.use('/api/referrals', referralRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/admin', authenticateToken, adminRoutes)

app.use((err, req, res) => {

  log.error('Unhandled server error', err)
  res.status(500).json({ error: 'Internal server error', message: process.env.NODE_ENV === 'development' ? err.message : undefined })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => log.info('Backend server started', { port: PORT }))
}

export default app
