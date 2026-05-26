import express from 'express'
import { supabase } from '../lib/supabase.js'
import axios from 'axios'

const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const payload = req.body
    const { data, error } = await supabase.from('contacts').insert(payload).select()
    if (error) return next(error)

    // optionally send notification email via Resend if configured
    try {
      if (process.env.RESEND_API_KEY) {
        await axios.post('https://api.resend.com/emails', {
          from: 'no-reply@essyhomecare.com',
          to: ['admin@essyhomecare.com'],
          subject: 'New contact form submission',
          html: `<p>New contact from ${payload.name} - ${payload.email}</p><pre>${JSON.stringify(payload, null, 2)}</pre>`
        }, { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' } })
      }
    } catch (e) {
      console.warn('Resend email failed', e?.message)
    }

    res.status(201).json(data)
  } catch (err) { next(err) }
})

export default router
