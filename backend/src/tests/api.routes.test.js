import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'

vi.mock('../lib/supabase.js', () => {
  const from = vi.fn()
  const updateUserById = vi.fn()
  const listUsers = vi.fn()
  const listBuckets = vi.fn()

  return {
    supabase: {
      from,
      auth: {
        admin: {
          updateUserById,
          listUsers,
        },
      },
      storage: {
        listBuckets,
      },
    },
  }
})

vi.mock('../middleware/auth.js', () => ({
  authenticateToken: (req, res, next) => next(),
  requireAdmin: (req, res, next) => next(),
}))

import { supabase } from '../lib/supabase.js'
import app from '../server.js'

const createQuery = (response = {}) => {
  const query = {
    select: vi.fn(() => query),
    order: vi.fn(() => Promise.resolve(response)),
    eq: vi.fn(() => query),
    single: vi.fn(() => Promise.resolve(response)),
    insert: vi.fn(() => ({ select: vi.fn().mockResolvedValue(response) })),
    update: vi.fn(() => ({ select: vi.fn().mockResolvedValue(response) })),
    delete: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve(response)) })),
    then: (onFulfilled, onRejected) => Promise.resolve(response).then(onFulfilled, onRejected),
    catch: (onRejected) => Promise.resolve(response).catch(onRejected),
  }
  return query
}

const referralPayload = {
  id: 'ref-1',
  patient_first_name: 'Jane',
  patient_last_name: 'Doe',
  phone: '555-1234',
  status: 'new',
  created_at: new Date().toISOString(),
}

const applicationPayload = {
  id: 'app-1',
  applicant_name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '555-1234',
  resume_url: 'https://example.com/resume.pdf',
  created_at: new Date().toISOString(),
}

const contactPayload = {
  id: 'contact-1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'I need help',
  created_at: new Date().toISOString(),
}

const jobPayload = {
  id: 'job-1',
  title: 'RN',
  type: 'Full-time',
  location: 'Tyngsboro',
  description: 'Test job',
  created_at: new Date().toISOString(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Backend API route tests', () => {
  it('returns referral list from admin referrals endpoint', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'referrals') {
        return createQuery({ data: [referralPayload], error: null })
      }
      return createQuery({ data: [], error: null })
    })

    const response = await request(app).get('/api/admin/referrals')

    expect(response.status).toBe(200)
    expect(response.body.data).toEqual([referralPayload])
    expect(supabase.from).toHaveBeenCalledWith('referrals')
  })

  it('creates a new referral through admin referrals POST', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'referrals') {
        return createQuery({ data: [referralPayload], error: null })
      }
      return createQuery({ data: [], error: null })
    })

    const response = await request(app)
      .post('/api/admin/referrals')
      .send({ patient_first_name: 'Jane', patient_last_name: 'Doe', phone: '555-1234' })

    expect(response.status).toBe(201)
    expect(response.body).toEqual(referralPayload)
  })

  it('returns contacts from admin contacts endpoint', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'contacts') {
        return createQuery({ data: [contactPayload], error: null })
      }
      return createQuery({ data: [], error: null })
    })

    const response = await request(app).get('/api/admin/contacts')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([contactPayload])
  })

  it('creates a new contact through admin contacts POST', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'contacts') {
        return createQuery({ data: [contactPayload], error: null })
      }
      return createQuery({ data: [], error: null })
    })

    const response = await request(app)
      .post('/api/admin/contacts')
      .send({ name: 'Jane Doe', email: 'jane@example.com', message: 'I need help' })

    expect(response.status).toBe(201)
    expect(response.body).toEqual(contactPayload)
  })

  it('returns applications from admin applications endpoint', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'applications') {
        return createQuery({ data: [applicationPayload], error: null })
      }
      return createQuery({ data: [], error: null })
    })

    const response = await request(app).get('/api/admin/applications')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([applicationPayload])
  })

  it('creates a new application through admin applications POST', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'applications') {
        return createQuery({ data: [applicationPayload], error: null })
      }
      return createQuery({ data: [], error: null })
    })

    const response = await request(app)
      .post('/api/admin/applications')
      .send({ applicant_name: 'Jane Doe', email: 'jane@example.com', phone: '555-1234' })

    expect(response.status).toBe(201)
    expect(response.body).toEqual(applicationPayload)
  })

  it('returns jobs from admin jobs endpoint', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'jobs') {
        return createQuery({ data: [jobPayload], error: null })
      }
      return createQuery({ data: [], error: null })
    })

    const response = await request(app).get('/api/admin/jobs')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([jobPayload])
  })

  it('creates a new job through admin jobs POST', async () => {
    supabase.from.mockImplementation((table) => {
      if (table === 'jobs') {
        return createQuery({ data: [jobPayload], error: null })
      }
      return createQuery({ data: [], error: null })
    })

    const response = await request(app)
      .post('/api/admin/jobs')
      .send({ title: 'RN', type: 'Full-time', location: 'Tyngsboro', description: 'Test job' })

    expect(response.status).toBe(201)
    expect(response.body).toEqual(jobPayload)
  })

  it('returns admin stats including referral breakdown', async () => {
    const referralData = { data: [referralPayload], error: null }
    const applicationData = { data: [applicationPayload], error: null }
    const contactData = { data: [contactPayload], error: null }
    const jobData = { data: [jobPayload], error: null }

    supabase.from.mockImplementation((table) => {
      if (table === 'referrals') return createQuery(referralData)
      if (table === 'applications') return createQuery(applicationData)
      if (table === 'contacts') return createQuery(contactData)
      if (table === 'jobs') return createQuery(jobData)
      return createQuery({ data: [], error: null })
    })

    const response = await request(app).get('/api/admin/stats')

    expect(response.status).toBe(200)
    expect(response.body.total_referrals).toBe(1)
    expect(response.body.total_applications).toBe(1)
    expect(response.body.total_contacts).toBe(1)
    expect(response.body.total_jobs).toBe(1)
    expect(response.body.status_breakdown).toEqual({ new: 1 })
  })

  it('assigns admin role to a user via admin user endpoint', async () => {
    supabase.auth.admin.updateUserById.mockResolvedValue({ data: { user: { id: 'user-1', email: 'admin@example.com', user_metadata: { role: 'admin' } } }, error: null })

    const response = await request(app).post('/api/admin/users/user-1/assign-admin')

    expect(response.status).toBe(200)
    expect(response.body.user.role).toBe('admin')
    expect(supabase.auth.admin.updateUserById).toHaveBeenCalledWith('user-1', { user_metadata: { role: 'admin' } })
  })

  it('lists admin users from admin users endpoint', async () => {
    supabase.auth.admin.listUsers.mockResolvedValue({ data: { users: [{ id: 'user-1', email: 'admin@example.com', user_metadata: { role: 'admin' } }] }, error: null })

    const response = await request(app).get('/api/admin/users')

    expect(response.status).toBe(200)
    expect(response.body.admin_users).toEqual([{ id: 'user-1', email: 'admin@example.com', role: 'admin' }])
  })
})
