import express from 'express'
import multer from 'multer'
import { supabase } from '../lib/supabase.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ error: 'File is required' })

    const filename = `${Date.now()}_${file.originalname}`
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads'

    const { data, error } = await supabase.storage.from(bucket).upload(filename, file.buffer, {
      contentType: file.mimetype,
      cacheControl: 'public, max-age=31536000'
    })

    if (error) return next(error)

    const { data: publicData, error: publicError } = supabase.storage.from(bucket).getPublicUrl(filename)
    if (publicError) return next(publicError)

    res.status(201).json({ 
      success: true,
      path: data.path, 
      publicUrl: publicData.publicUrl,
      filename: file.originalname,
      size: file.size,
      type: file.mimetype
    })
  } catch (err) {
    next(err)
  }
})

export default router
