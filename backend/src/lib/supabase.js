import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is required for backend startup')
}

if (!supabaseKey) {
  throw new Error('SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY is required for backend startup')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
