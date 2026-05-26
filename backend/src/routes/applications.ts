import { Router, Response } from 'express'
import { AuthRequest, validateAdminRole } from '../middleware/auth.js'
import { applicationSchema } from '../schemas/validation.js'
import { supabase } from '../server.js'

const router = Router()

// GET all applications (admin only)
router.get('/', validateAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(title)')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// POST new application
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const validated = applicationSchema.parse(req.body)

    const { data, error } = await supabase
      .from('applications')
      .insert([{ ...validated, status: 'received' }])
      .select()

    if (error) throw error

    // TODO: Send confirmation email to applicant
    res.status(201).json(data[0])
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// PATCH application status (admin only)
router.patch('/:id', validateAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body

    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', req.params.id)
      .select()

    if (error) throw error
    if (!data?.length) return res.status(404).json({ error: 'Application not found' })

    res.json(data[0])
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
