import express from 'express'
import { supabase } from '../lib/supabase.js'
import { validateReferral } from '../lib/validators.js'
import { sendReferralEmails } from '../services/referralEmailService.js'

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
      await sendReferralEmails(created)
    } catch (emailErr) {
      console.warn('Referral email failed', emailErr?.message || emailErr)
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

