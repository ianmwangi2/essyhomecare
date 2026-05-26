import { Router, Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { contactSchema } from '../schemas/validation.js'
import { supabase } from '../server.js'

const router = Router()

// POST contact form
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const validated = contactSchema.parse(req.body)

    const { data, error } = await supabase
      .from('contacts')
      .insert([validated])
      .select()

    if (error) throw error

    // TODO: Send acknowledgment email to submitter
    res.status(201).json(data[0])
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
