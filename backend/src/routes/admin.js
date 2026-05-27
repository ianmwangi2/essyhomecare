import express from 'express'
import { supabase } from '../lib/supabase.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAdmin)

// Assign admin role to a user (only existing admins can do this)
router.post('/users/:userId/assign-admin', async (req, res, next) => {
  try {
    const { userId } = req.params
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    // Use Supabase admin API to update user metadata
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: 'admin' }
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ 
      message: 'Admin role assigned successfully', 
      user: { id: data.user.id, email: data.user.email, role: 'admin' } 
    })
  } catch (err) {
    next(err)
  }
})

// Remove admin role from a user
router.post('/users/:userId/remove-admin', async (req, res, next) => {
  try {
    const { userId } = req.params
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    // Use Supabase admin API to update user metadata
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: 'user' }
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ 
      message: 'Admin role removed successfully', 
      user: { id: data.user.id, email: data.user.email, role: 'user' } 
    })
  } catch (err) {
    next(err)
  }
})

// List all admin users
router.get('/users', async (req, res, next) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    const admins = data.users.filter(u => u.user_metadata?.role === 'admin' || u.app_metadata?.role === 'admin')
    const totalUsers = data.users.length

    res.json({
      total_users: totalUsers,
      admin_users: admins.map(u => ({ id: u.id, email: u.email, role: u.user_metadata?.role || u.app_metadata?.role || 'user' }))
    })
  } catch (err) {
    next(err)
  }
})

router.get('/stats', async (req, res, next) => {
  try {
    const [{ data: referralData, error: referralError }, { data: applicationData, error: applicationError }, { data: contactData, error: contactError }, { data: jobData, error: jobError }] = await Promise.all([
      supabase.from('referrals').select('id, status, created_at'),
      supabase.from('applications').select('id'),
      supabase.from('contacts').select('id'),
      supabase.from('jobs').select('id')
    ])

    if (referralError || applicationError || contactError || jobError) {
      return next(referralError || applicationError || contactError || jobError)
    }

    const referrals = referralData || []
    const totalReferrals = referrals.length
    const referralsThisWeek = referrals.filter((row) => new Date(row.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
    const referralsThisMonth = referrals.filter((row) => new Date(row.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
    const status_breakdown = referrals.reduce((acc, row) => {
      const status = row.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    res.json({
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      total_referrals: totalReferrals,
      referrals_this_week: referralsThisWeek,
      referrals_this_month: referralsThisMonth,
      total_applications: applicationData?.length ?? 0,
      total_contacts: contactData?.length ?? 0,
      total_jobs: jobData?.length ?? 0,
      status_breakdown,
    })
  } catch (err) {
    next(err)
  }
})

const paginate = (data = [], page = 1, pageSize = 50) => {
  const start = (page - 1) * pageSize
  return data.slice(start, start + pageSize)
}

router.get('/referrals', async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1
    const pageSize = Number(req.query.pageSize) || 100
    const { data, error } = await supabase.from('referrals').select('*').order('created_at', { ascending: false })
    if (error) return next(error)
    res.json({ data: paginate(data, page, pageSize), page, pageSize, total: data.length })
  } catch (err) { next(err) }
})

// Get single referral
router.get('/referrals/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('referrals').select('*').eq('id', id).single()
    if (error) return next(error)
    if (!data) return res.status(404).json({ error: 'Referral not found' })
    res.json(data)
  } catch (err) { next(err) }
})

// Create referral
router.post('/referrals', async (req, res, next) => {
  try {
    const { error, data } = await supabase.from('referrals').insert([req.body]).select()
    if (error) return next(error)
    res.status(201).json(data[0])
  } catch (err) { next(err) }
})

// Update referral (status, approval, etc.)
router.put('/referrals/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { error, data } = await supabase.from('referrals').update(req.body).eq('id', id).select()
    if (error) return next(error)
    if (data.length === 0) return res.status(404).json({ error: 'Referral not found' })
    res.json(data[0])
  } catch (err) { next(err) }
})

// Approve referral (convenience endpoint)
router.post('/referrals/:id/approve', async (req, res, next) => {
  try {
    const { id } = req.params
    const { error, data } = await supabase.from('referrals').update({ status: 'approved' }).eq('id', id).select()
    if (error) return next(error)
    if (data.length === 0) return res.status(404).json({ error: 'Referral not found' })
    res.json({ message: 'Referral approved', data: data[0] })
  } catch (err) { next(err) }
})

// Reject referral (convenience endpoint)
router.post('/referrals/:id/reject', async (req, res, next) => {
  try {
    const { id } = req.params
    const reason = req.body?.reason || 'No reason provided'
    const { error, data } = await supabase.from('referrals').update({ status: 'rejected', reject_reason: reason }).eq('id', id).select()
    if (error) return next(error)
    if (data.length === 0) return res.status(404).json({ error: 'Referral not found' })
    res.json({ message: 'Referral rejected', data: data[0] })
  } catch (err) { next(err) }
})

// Delete referral
router.delete('/referrals/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { error } = await supabase.from('referrals').delete().eq('id', id)
    if (error) return next(error)
    res.json({ message: 'Referral deleted successfully' })
  } catch (err) { next(err) }
})

router.get('/contacts', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// Get single contact
router.get('/contacts/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('contacts').select('*').eq('id', id).single()
    if (error) return next(error)
    if (!data) return res.status(404).json({ error: 'Contact not found' })
    res.json(data)
  } catch (err) { next(err) }
})

// Create contact
router.post('/contacts', async (req, res, next) => {
  try {
    const { error, data } = await supabase.from('contacts').insert([req.body]).select()
    if (error) return next(error)
    res.status(201).json(data[0])
  } catch (err) { next(err) }
})

// Update contact
router.put('/contacts/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { error, data } = await supabase.from('contacts').update(req.body).eq('id', id).select()
    if (error) return next(error)
    if (data.length === 0) return res.status(404).json({ error: 'Contact not found' })
    res.json(data[0])
  } catch (err) { next(err) }
})

// Delete contact
router.delete('/contacts/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { error } = await supabase.from('contacts').delete().eq('id', id)
    if (error) return next(error)
    res.json({ message: 'Contact deleted successfully' })
  } catch (err) { next(err) }
})

router.get('/applications', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// Get single application
router.get('/applications/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('applications').select('*').eq('id', id).single()
    if (error) return next(error)
    if (!data) return res.status(404).json({ error: 'Application not found' })
    res.json(data)
  } catch (err) { next(err) }
})

// Create application
router.post('/applications', async (req, res, next) => {
  try {
    const { error, data } = await supabase.from('applications').insert([req.body]).select()
    if (error) return next(error)
    res.status(201).json(data[0])
  } catch (err) { next(err) }
})

// Update application (status, approval, etc.)
router.put('/applications/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { error, data } = await supabase.from('applications').update(req.body).eq('id', id).select()
    if (error) return next(error)
    if (data.length === 0) return res.status(404).json({ error: 'Application not found' })
    res.json(data[0])
  } catch (err) { next(err) }
})

// Approve application (convenience endpoint)
router.post('/applications/:id/approve', async (req, res, next) => {
  try {
    const { id } = req.params
    const { error, data } = await supabase.from('applications').update({ status: 'approved' }).eq('id', id).select()
    if (error) return next(error)
    if (data.length === 0) return res.status(404).json({ error: 'Application not found' })
    res.json({ message: 'Application approved', data: data[0] })
  } catch (err) { next(err) }
})

// Reject application (convenience endpoint)
router.post('/applications/:id/reject', async (req, res, next) => {
  try {
    const { id } = req.params
    const reason = req.body?.reason || 'No reason provided'
    const { error, data } = await supabase.from('applications').update({ status: 'rejected', reject_reason: reason }).eq('id', id).select()
    if (error) return next(error)
    if (data.length === 0) return res.status(404).json({ error: 'Application not found' })
    res.json({ message: 'Application rejected', data: data[0] })
  } catch (err) { next(err) }
})

// Delete application
router.delete('/applications/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (error) return next(error)
    res.json({ message: 'Application deleted successfully' })
  } catch (err) { next(err) }
})

router.get('/jobs', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

// Get single job
router.get('/jobs/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single()
    if (error) return next(error)
    if (!data) return res.status(404).json({ error: 'Job not found' })
    res.json(data)
  } catch (err) { next(err) }
})

// Create job
router.post('/jobs', async (req, res, next) => {
  try {
    const { error, data } = await supabase.from('jobs').insert([req.body]).select()
    if (error) return next(error)
    res.status(201).json(data[0])
  } catch (err) { next(err) }
})

// Update job
router.put('/jobs/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { error, data } = await supabase.from('jobs').update(req.body).eq('id', id).select()
    if (error) return next(error)
    if (data.length === 0) return res.status(404).json({ error: 'Job not found' })
    res.json(data[0])
  } catch (err) { next(err) }
})

// Publish/unpublish job
router.post('/jobs/:id/publish', async (req, res, next) => {
  try {
    const { id } = req.params
    const isPublished = req.body?.is_active !== false
    const { error, data } = await supabase.from('jobs').update({ is_active: isPublished }).eq('id', id).select()
    if (error) return next(error)
    if (data.length === 0) return res.status(404).json({ error: 'Job not found' })
    res.json({ message: `Job ${isPublished ? 'published' : 'unpublished'}`, data: data[0] })
  } catch (err) { next(err) }
})

// Delete job
router.delete('/jobs/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) return next(error)
    res.json({ message: 'Job deleted successfully' })
  } catch (err) { next(err) }
})

router.get('/health', (req, res) => res.json({ status: 'ok' }))

export default router
