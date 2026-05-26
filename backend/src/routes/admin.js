import express from 'express'

const router = express.Router()

// Example admin endpoints for the admin UI
router.get('/stats', async (req, res) => {
  // Provide minimal stats; expand as needed
  res.json({ uptime: process.uptime(), timestamp: new Date().toISOString() })
})

router.get('/health', (req, res) => res.json({ status: 'ok' }))

export default router
