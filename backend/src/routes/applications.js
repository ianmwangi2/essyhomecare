import express from 'express'
import { supabase } from '../lib/supabase.js'
import { validateApplication } from '../lib/validators.js'
import { sendAdminEmail, sendConfirmationEmail } from '../lib/resend.js'

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
      await sendAdminEmail({
        subject: 'New job application submitted',
        html: `
          <p><strong>Applicant:</strong> ${app.applicant_name}</p>
          <p><strong>Email:</strong> ${app.email}</p>
          ${app.phone ? `<p><strong>Phone:</strong> ${app.phone}</p>` : ''}
          ${app.job_id ? `<p><strong>Job ID:</strong> ${app.job_id}</p>` : ''}
          ${app.cover_letter ? `<p><strong>Cover Letter:</strong></p><p>${app.cover_letter}</p>` : ''}
          ${app.resume_url ? `<p><strong>Resume URL:</strong> <a href="${app.resume_url}">Download</a></p>` : ''}
        `,
      })

      await sendConfirmationEmail({
        to: app.email,
        subject: 'Essy Homecare — We received your application',
        html: `
          <p>Hi ${app.applicant_name || ''},</p>
          <p>Thank you for applying to Essy Homecare. We’ve received your application and our team will review it shortly.</p>
          <p>If you have any questions, reply to this email.</p>
          <p style="margin-top: 16px;">— Essy Homecare</p>
        `,
      })
    } catch (emailErr) {
      console.warn('SendGrid application email failed', emailErr?.message || emailErr)
    }

    res.status(201).json(created)
  } catch (err) { next(err) }
})

export default router

