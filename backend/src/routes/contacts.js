import express from 'express'
import { supabase } from '../lib/supabase.js'
import { validateContact } from '../lib/validators.js'
import { contactAutoReply, contactInternalAlert } from '../lib/emailService.js'

const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const { valid, errors, data } = validateContact(req.body)
    if (!valid) return res.status(400).json({ error: errors.join(', ') })

    const { data: created, error } = await supabase.from('contacts').insert(data).select()
    if (error) return next(error)

    try {
      await Promise.all([
        contactAutoReply({ to: data.email, name: data.name }),
        contactInternalAlert({ name: data.name, email: data.email, message: data.message }),
      ])
    } catch (emailErr) {
      // Don't fail the form submission if email sending fails.
      console.warn('Contact emails failed', emailErr?.message || emailErr)
    }

    res.status(201).json(created)
  } catch (err) { next(err) }
})

export default router

