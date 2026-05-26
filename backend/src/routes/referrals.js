import express from 'express'
import { supabase } from '../lib/supabase.js'

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
    const payload = req.body
    const { data, error } = await supabase.from('referrals').insert(payload).select()
    if (error) return next(error)
    res.status(201).json(data)
  } catch (err) { next(err) }
})

export default router
