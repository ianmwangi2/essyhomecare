import express from 'express'
import { supabase } from '../lib/supabase.js'
import { validateContact } from '../lib/validators.js'
import axios from 'axios'

const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const { valid, errors, data } = validateContact(req.body)
    if (!valid) return res.status(400).json({ error: errors.join(', ') })

    const { data: created, error } = await supabase.from('contacts').insert(data).select()
    if (error) return next(error)

    if (process.env.RESEND_API_KEY) {
      try {
        await axios.post('https://api.resend.com/emails', {
          from: 'no-reply@essyhomecare.com',
          to: ['admin@essyhomecare.com'],
          subject: 'New contact form submission',
          html: `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
          `
        }, { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' } })
      } catch (emailErr) {
        console.warn('Resend email failed', emailErr?.message || emailErr)
      }
    }

    res.status(201).json(created)
  } catch (err) { next(err) }
})

export default router
