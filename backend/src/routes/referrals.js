import express from 'express'
import { supabase } from '../lib/supabase.js'
import { validateReferral } from '../lib/validators.js'
import { sendAdminEmail, sendConfirmationEmail } from '../lib/sendgrid.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('referrals').select('*').order('created_at', { ascending: false })
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const { valid, errors, data: referral } = validateReferral(req.body)
    if (!valid) return res.status(400).json({ error: errors.join(', ') })

    const { data, error } = await supabase.from('referrals').insert(referral).select()
    if (error) return next(error)

    const created = Array.isArray(data) ? data[0] : data

    // Send admin notification + confirmation (fail-safe: don’t break submission).
    try {
      await sendAdminEmail({
        subject: 'New referral submitted',
        html: `
          <p><strong>Patient:</strong> ${created.patient_first_name} ${created.patient_last_name}</p>
          ${created.dob ? `<p><strong>DOB:</strong> ${created.dob}</p>` : ''}
          ${created.gender ? `<p><strong>Gender:</strong> ${created.gender}</p>` : ''}
          ${created.address ? `<p><strong>Address:</strong> ${created.address}</p>` : ''}
          ${created.city ? `<p><strong>City:</strong> ${created.city}</p>` : ''}
          ${created.state ? `<p><strong>State:</strong> ${created.state}</p>` : ''}
          ${created.zip ? `<p><strong>ZIP:</strong> ${created.zip}</p>` : ''}
          <p><strong>Phone:</strong> ${created.phone}</p>
          ${created.insurance_type ? `<p><strong>Insurance:</strong> ${created.insurance_type}</p>` : ''}
          ${created.referring_physician ? `<p><strong>Referring Physician:</strong> ${created.referring_physician}</p>` : ''}
          ${created.referring_facility ? `<p><strong>Referring Facility:</strong> ${created.referring_facility}</p>` : ''}
          ${created.diagnosis ? `<p><strong>Diagnosis:</strong> ${created.diagnosis}</p>` : ''}
          ${Array.isArray(created.services_requested) ? `<p><strong>Services Requested:</strong> ${created.services_requested.join(', ')}</p>` : ''}
          ${created.preferred_contact ? `<p><strong>Preferred Contact:</strong> ${created.preferred_contact}</p>` : ''}
          ${created.preferred_office ? `<p><strong>Preferred Office:</strong> ${created.preferred_office}</p>` : ''}
          <hr/>
          <p><strong>Submitter:</strong> ${created.submitter_name}</p>
          ${created.submitter_role ? `<p><strong>Role:</strong> ${created.submitter_role}</p>` : ''}
          ${created.submitter_phone ? `<p><strong>Submitter Phone:</strong> ${created.submitter_phone}</p>` : ''}
          <p><strong>Submitter Email:</strong> ${created.submitter_email}</p>
        `,
      })

      await sendConfirmationEmail({
        to: created.submitter_email,
        subject: 'Essy Homecare — We received your referral',
        html: `
          <p>Hi ${created.submitter_name || 'there'},</p>
          <p>Thanks for submitting your referral. Our team will review it and reach out to coordinate next steps.</p>
          <p>If you need to make changes, you can reply to this email.</p>
          <p style="margin-top: 16px;">— Essy Homecare</p>
        `,
      })
    } catch (emailErr) {
      console.warn('SendGrid referral email failed', emailErr?.message || emailErr)
    }

    res.status(201).json(data)
  } catch (err) { next(err) }
})


router.patch('/:id', async (req, res, next) => {
  try {
    const updates = {}
    if (typeof req.body.status === 'string') updates.status = req.body.status
    if (typeof req.body.assigned_to === 'string') updates.assigned_to = req.body.assigned_to
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No valid update fields provided' })

    const { data, error } = await supabase.from('referrals').update(updates).eq('id', req.params.id).select()
    if (error) return next(error)
    if (!data || data.length === 0) return res.status(404).json({ error: 'Referral not found' })
    res.json(data[0])
  } catch (err) { next(err) }
})

export default router

