export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization
  const token = authHeader?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Access token required' })

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY
  if (!supabaseUrl || !serviceRoleKey) return res.status(500).json({ error: 'Server auth not configured' })

  try {
    const r = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: serviceRoleKey, 'Content-Type': 'application/json' }
    })
    if (!r.ok) return res.status(403).json({ error: 'Invalid or expired token' })
    const user = await r.json()
    req.user = { id: user.id, email: user.email, role: user.user_metadata?.role || user.app_metadata?.role || 'user' }
    next()
  } catch (err) {
    next(err)
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })
  next()
}
