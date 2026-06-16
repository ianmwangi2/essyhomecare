import express from 'express'
import { supabase } from '../lib/supabase.js'
import { validateContact } from '../lib/validators.js'
import { sendContactNotification } from '../services/contactEmailService.js'

const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const { valid, errors, data } = validateContact(req.body)
    if (!valid) return res.status(400).json({ error: errors.join(', ') })

    const { data: created, error } = await supabase.from('contacts').insert(data).select()
    if (error) return next(error)

    try {
      await sendContactNotification(data)
    } catch (emailErr) {
      // Don't fail the form submission if email sending fails.
      console.warn('Contact notification email failed', emailErr?.message || emailErr)
    }

    res.status(201).json(created)
  } catch (err) { next(err) }
})

export default router

