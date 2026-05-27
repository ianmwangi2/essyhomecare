import express from 'express'
import { supabase } from '../lib/supabase.js'
import { validateJob } from '../lib/validators.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    if (error) return next(error)
    res.json(data)
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const { valid, errors, data } = validateJob(req.body)
    if (!valid) return res.status(400).json({ error: errors.join(', ') })

    const { data: created, error } = await supabase.from('jobs').insert(data).select()
    if (error) return next(error)
    res.status(201).json(created)
  } catch (err) { next(err) }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const updates = {}
    if (typeof req.body.title === 'string') updates.title = req.body.title.trim()
    if (typeof req.body.type === 'string') updates.type = req.body.type.trim()
    if (typeof req.body.location === 'string') updates.location = req.body.location.trim()
    if (typeof req.body.description === 'string') updates.description = req.body.description.trim()
    if (typeof req.body.is_active === 'boolean') updates.is_active = req.body.is_active
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No valid update fields provided' })

    const { data, error } = await supabase.from('jobs').update(updates).eq('id', req.params.id).select()
    if (error) return next(error)
    if (!data || data.length === 0) return res.status(404).json({ error: 'Job not found' })
    res.json(data[0])
  } catch (err) { next(err) }
})

export default router
