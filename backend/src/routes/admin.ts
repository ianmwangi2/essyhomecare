import { Router, Response } from 'express'
import { AuthRequest, validateAdminRole } from '../middleware/auth.js'
import { supabase } from '../server.js'

const router = Router()

// GET dashboard stats
router.get('/stats', validateAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get referral stats
    const { data: weekReferrals } = await supabase
      .from('referrals')
      .select('*')
      .gte('created_at', weekAgo.toISOString())

    const { data: monthReferrals } = await supabase
      .from('referrals')
      .select('*')
      .gte('created_at', monthAgo.toISOString())

    const { data: allReferrals } = await supabase
      .from('referrals')
      .select('*')

    // Get application count
    const { count: applicationCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact' })

    // Get status breakdown
    const { data: statusBreakdown } = await supabase
      .from('referrals')
      .select('status')

    const breakdown = statusBreakdown as Array<{ status: string }> | null

    const statusCounts = {
      new: breakdown?.filter((r) => r.status === 'new').length || 0,
      in_review: breakdown?.filter((r) => r.status === 'in_review').length || 0,
      admitted: breakdown?.filter((r) => r.status === 'admitted').length || 0,
      closed: breakdown?.filter((r) => r.status === 'closed').length || 0,
    }

    res.json({
      referrals_this_week: weekReferrals?.length || 0,
      referrals_this_month: monthReferrals?.length || 0,
      total_referrals: allReferrals?.length || 0,
      total_applications: applicationCount || 0,
      status_breakdown: statusCounts,
    })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// GET all contact submissions (admin only)
router.get('/contacts', validateAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
