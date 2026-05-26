import { Request, Response, NextFunction } from 'express'

export type AuthRequest<P = Record<string, any>, ResBody = any, ReqBody = any, ReqQuery = any> =
  Request<P, ResBody, ReqBody, ReqQuery> & {
    user?: {
      id: string
      email: string
      role: string
    }
  }

const fetchSupabaseUser = async (token: string) => {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase URL and service role key are required for auth validation')
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: serviceRoleKey,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Unable to validate Supabase session')
  }

  const user = await response.json()
  return user
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const user = await fetchSupabaseUser(token)
    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || user.app_metadata?.role || 'user'
    }
    next()
  } catch (err: any) {
    res.status(403).json({ error: err?.message || 'Invalid or expired token' })
  }
}

export const validateAdminRole = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}
