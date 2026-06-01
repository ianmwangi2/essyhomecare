import express from 'express'
import { supabase } from '../lib/supabase.js'
import { validateContact } from '../lib/validators.js'
import { sendAdminEmail } from '../lib/resend.js'

const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const { valid, errors, data } = validateContact(req.body)
    if (!valid) return res.status(400).json({ error: errors.join(', ') })

    const { data: created, error } = await supabase.from('contacts').insert(data).select()
    if (error) return next(error)

    try {
      await sendAdminEmail({
        subject: 'New contact form submission',
        html: `
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          ${data.preferred_office ? `<p><strong>Preferred office:</strong> ${data.preferred_office}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        `,
      })
    } catch (emailErr) {
      // Don’t fail the form submission if email sending fails.
      console.warn('SendGrid admin email failed', emailErr?.message || emailErr)
    }

    res.status(201).json(created)
  } catch (err) { next(err) }
})

export default router

