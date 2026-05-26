import { Router, Response } from 'express'
import { AuthRequest, validateAdminRole } from '../middleware/auth.js'
import { jobSchema } from '../schemas/validation.js'
import { supabase } from '../server.js'

const router = Router()

// GET all active jobs
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// POST new job (admin only)
router.post('/', validateAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const validated = jobSchema.parse(req.body)

    const { data, error } = await supabase
      .from('jobs')
      .insert([validated])
      .select()

    if (error) throw error
    res.status(201).json(data[0])
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// PATCH job (admin only)
router.patch('/:id', validateAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update(req.body)
      .eq('id', req.params.id)
      .select()

    if (error) throw error
    if (!data?.length) return res.status(404).json({ error: 'Job not found' })

    res.json(data[0])
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE job (admin only)
router.delete('/:id', validateAdminRole, async (req: AuthRequest, res: Response) => {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.status(204).send()
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
