import { Router, Response } from 'express'
import { AuthRequest, validateAdminRole } from '../middleware/auth.js'
import { referralSchema } from '../schemas/validation.js'
import { supabase } from '../server.js'

const router = Router()

// GET all referrals (admin only)
router.get('/', validateAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// POST new referral
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const validated = referralSchema.parse(req.body)

    const { data, error } = await supabase
      .from('referrals')
      .insert([validated])
      .select()

    if (error) throw error

    // TODO: Send email notification
    res.status(201).json(data[0])
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// PATCH update referral status (admin only)
router.patch('/:id', validateAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body

    if (!['new', 'in_review', 'admitted', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const { data, error } = await supabase
      .from('referrals')
      .update({ status })
      .eq('id', req.params.id)
      .select()

    if (error) throw error
    if (!data?.length) return res.status(404).json({ error: 'Referral not found' })

    res.json(data[0])
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
