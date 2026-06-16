import express from 'express'
import { supabase } from '../lib/supabase.js'
import { validateApplication } from '../lib/validators.js'
import { sendApplicationEmails } from '../services/applicationEmailService.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false })
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const { valid, errors, data } = validateApplication(req.body)
    if (!valid) return res.status(400).json({ error: errors.join(', ') })

    const { data: created, error } = await supabase.from('applications').insert(data).select()
    if (error) return next(error)

    const app = Array.isArray(created) ? created[0] : created

    try {
      await sendApplicationEmails(app)
    } catch (emailErr) {
      console.warn('Application email failed', emailErr?.message || emailErr)
    }

    res.status(201).json(created)
  } catch (err) { next(err) }
})

export default router


